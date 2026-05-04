import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/enum/role';
import { Payment } from './entities/payment.entity';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ApiBody({ type: CreatePaymentDto })
  @ApiCreatedResponse({ type: Payment, description: 'Correct verification, payment registered succesfully' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "Only users can register payments" })
  @ApiBadRequestResponse({ description: "Missing or incorrect fields" })
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    return this.paymentService.create(createPaymentDto, req.member.id);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEVELOPER)
  @ApiOkResponse({ type: Payment, isArray: true, description: 'Correct verification' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "Only admins and developers can view all payments" })
  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.USER)
  @ApiOkResponse({ type: Payment, description: 'Correct verification' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "You can only view your own payments" })
  @ApiNotFoundResponse({ description: "Payment not found" })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const member = req.member;
    const payment = await this.paymentService.findOne(+id);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (member.role === Role.USER && payment.member.membership_id !== member.id) {
      throw new ForbiddenException('You can only view your own payments');
    }

    return payment;
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEVELOPER)
  @ApiBody({ type: UpdatePaymentDto })
  @ApiOkResponse({ type: Payment, description: 'Correct verification, updated succesfully' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "Users can not modify" })
  @ApiNotFoundResponse({ description: "Payment not found" })
  @ApiBadRequestResponse({ description: "Incorrect fields" })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: 'Correct verification, deleted succesfully' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "Only admins can delete" })
  @ApiNotFoundResponse({ description: "Payment not found" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
