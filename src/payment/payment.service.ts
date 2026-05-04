import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {

  constructor(@InjectRepository(Payment) private repoPayment:Repository<Payment>){
  }

  async create(createPaymentDto: CreatePaymentDto, memberId:number) : Promise<Payment | null>{
    const payment = this.repoPayment.create({
        ...createPaymentDto, member: { membership_id: memberId }});
    const saved = await this.repoPayment.save(payment);
    return this.findOne(saved.payment_id);
  }

  async findAll(): Promise<Payment[]> {
      return this.repoPayment.find({ relations: ['member'] });
  }

  async findOne(id: number): Promise<Payment | null> {
    return this.repoPayment.findOne({where: { payment_id: id }, relations: ['member']});
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) : Promise<Payment | null> {
    const payment = await this.findOne(id);
    if (!payment) throw new NotFoundException('Payment not found');
    await this.repoPayment.update(id, updatePaymentDto)
    return this.findOne(id);
  }

  async remove(id: number) : Promise<void>{
    const payment = await this.findOne(id);
    if (!payment) throw new NotFoundException('Payment not found');
    await this.repoPayment.delete(id)
  }
}