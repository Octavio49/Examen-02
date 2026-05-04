import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BookLoanService } from './book-loan.service';
import { CreateBookLoanDto } from './dto/create-book-loan.dto';
import { UpdateBookLoanDto } from './dto/update-book-loan.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/enum/role';
import { BookLoan } from './entities/book-loan.entity';

@Controller('book-loan')
export class BookLoanController {
  constructor(private readonly bookLoanService: BookLoanService) {}

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ApiBody({ type: CreateBookLoanDto })
  @ApiCreatedResponse({ type: BookLoan, description: 'Correct verification, book loan registered succesfully' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "Only users can register book loans" })
  @ApiBadRequestResponse({ description: "Missing or incorrect date format" })
  @Post()
  create(@Body() createBookLoanDto: CreateBookLoanDto, @Request() req) {
    return this.bookLoanService.create(createBookLoanDto, req.member.id);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEVELOPER)
  @ApiOkResponse({ type: BookLoan, isArray: true, description: 'Correct verification' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "Only admins and developers can view all loans" })
  @Get()
  findAll() {
    return this.bookLoanService.findAll();
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.USER)
  @ApiOkResponse({ type: BookLoan, description: 'Correct verification' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "You can only view your own loans" })
  @ApiNotFoundResponse({ description: "Loan not found" })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const member = req.member
    const loan = await this.bookLoanService.findOne(+id)

    if(!loan){
      throw new NotFoundException("Loan not found")
    }

    if(member.role === Role.USER && loan.member.membership_id !== member.id){
      throw new ForbiddenException("You can only view your own loans")
    }

    return loan;
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEVELOPER)
  @ApiBody({ type: UpdateBookLoanDto })
  @ApiOkResponse({ type: BookLoan, description: 'Correct verification, updated succesfully' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "Users can not modify" })
  @ApiNotFoundResponse({ description: "Loan not found" })
  @ApiBadRequestResponse({ description: "Incorrect date format" })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookLoanDto: UpdateBookLoanDto) {
    return this.bookLoanService.update(+id, updateBookLoanDto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: 'Correct verification, deleted succesfully' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "Only admins can delete" })
  @ApiNotFoundResponse({ description: "Loan not found" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookLoanService.remove(+id);
  }
}
