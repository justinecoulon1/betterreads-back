import { Injectable } from '@nestjs/common';
import { BookRepository } from '../../database/book/book.repository';
import { Book } from '../../database/model/book.entity';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  getFiveLastBooks(): Promise<Book[]> {
    return this.bookRepository.findFiveLast();
  }

  getBookById(id: number): Promise<Book> {
    return this.bookRepository.findById(id);
  }
}
