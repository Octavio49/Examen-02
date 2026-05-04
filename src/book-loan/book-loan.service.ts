import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookLoanDto } from './dto/create-book-loan.dto';
import { UpdateBookLoanDto } from './dto/update-book-loan.dto';
import { BookLoan } from './entities/book-loan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Book } from 'src/book/entities/book.entity';

@Injectable()
export class BookLoanService {

  constructor(@InjectRepository(BookLoan) private repoBookL: Repository<BookLoan>,
    @InjectRepository(Book) private repoBook: Repository<Book>) {
  }

  async create(createBookLoanDto: CreateBookLoanDto, memberId: number): Promise<BookLoan | null> {
    const books = await this.repoBook.findBy({
      book_id: In(createBookLoanDto.bookIds)
    });
    if (books.length !== createBookLoanDto.bookIds.length) {
      throw new NotFoundException('One or more books not found');
    }

    const bookL = this.repoBookL.create({
      ...createBookLoanDto,
      member: { membership_id: memberId },
      books: createBookLoanDto.bookIds.map(id => ({ book_id: id }))
    });
    const saved = await this.repoBookL.save(bookL);
    return this.findOne(saved.loan_id);
  }

  async findAll(): Promise<BookLoan[]> {
      return this.repoBookL.find({ relations: ['member', 'books'] });
  }

  async findOne(id: number): Promise<BookLoan | null> {
      return this.repoBookL.findOne({
          where: { loan_id: id },
          relations: ['member', 'books']
      });
  }

  async update(id: number, updateBookLoanDto: UpdateBookLoanDto) : Promise<BookLoan | null> {
    const loan = await this.findOne(id);
    if (!loan) throw new NotFoundException('Book loan not found');
    await this.repoBookL.update(id, updateBookLoanDto)
    return this.findOne(id);
  }

  async remove(id: number) : Promise<void> {
    const loan = await this.findOne(id);
    if (!loan) throw new NotFoundException('Book loan not found');
    await this.repoBookL.delete(id);
  }
}