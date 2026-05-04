import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {

  constructor(@InjectRepository(Book) private repoBook:Repository<Book>){
    }

  async create(createBookDto: CreateBookDto) : Promise<Book> {
    const isbnExist= await this.repoBook.findOneBy({isbn:createBookDto.isbn})
    if(isbnExist){
      const error={
                  'statusCode':409,
                  'error': 'conflict',
                  'message': ["ISBN already exist"]
              }
              throw new ConflictException(error)
    }
    return this.repoBook.save(createBookDto);
  }

  async findAll() : Promise<Book[]>{
    return this.repoBook.find();
  }

  async findOne(id: number) : Promise<Book|null> {
    return this.repoBook.findOneBy({book_id:id});
  }

  async update(id: number, updateBookDto: UpdateBookDto) : Promise<Book|null>{
    const book = await this.findOne(id);
    if (!book) throw new NotFoundException('Book not found');
    await this.repoBook.update(id, updateBookDto)
    return this.findOne(id);
  }

  async remove(id: number) : Promise<void> {
    const book = await this.findOne(id);
    if (!book) throw new NotFoundException('Book not found');
    await this.repoBook.delete(id);
  }
}