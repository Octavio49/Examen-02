import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/enum/role';
import { Book } from './entities/book.entity';

@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER, Role.ADMIN)
  @ApiBody({type:CreateBookDto})
  @ApiCreatedResponse({type:Book, description:'Correct verification, book registered succesfully'})
  @ApiUnauthorizedResponse({description:"Expired or invalid token"})
  @ApiForbiddenResponse({description:"Users can't register new books"})
  @ApiBadRequestResponse({description:"ISBN length different than 17, missing or incorrect fields"})
  @ApiConflictResponse({description:"Duplicate ISBN"})
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER, Role.ADMIN, Role.USER)
  @ApiOkResponse({type:Book, isArray:true , description:'Correct verification'})
  @ApiUnauthorizedResponse({description:"Expired or invalid token"})
  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER, Role.ADMIN, Role.USER)
  @ApiOkResponse({type:Book, description:'Correct verification'})
  @ApiUnauthorizedResponse({description:"Expired or invalid token"})
  @ApiNotFoundResponse({description:"Book does not exist"})
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const book = await this.bookService.findOne(+id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER, Role.ADMIN)
  @ApiBody({type:UpdateBookDto})
  @ApiOkResponse({type:Book, description:'Correct verification, book updated succesfully'})
  @ApiUnauthorizedResponse({description:"Expired or invalid token"})
  @ApiForbiddenResponse({description:"Users can't update books"})
  @ApiBadRequestResponse({description:"ISBN length different than 17 or incorrect fields"})
  @ApiNotFoundResponse({description:"Book does not exist"})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({description:'Correct verification, book deleted succesfully'})
  @ApiUnauthorizedResponse({description:"Expired or invalid token"})
  @ApiForbiddenResponse({description:"Only admins can delete books"})
  @ApiNotFoundResponse({description:"Book does not exist"})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
