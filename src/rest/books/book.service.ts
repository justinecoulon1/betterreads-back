import { Injectable } from '@nestjs/common';
import { BookRepository } from '../../database/book/book.repository';
import { Book } from '../../database/model/book.entity';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  getLatestBooks(): Promise<Book[]> {
    return this.bookRepository.findLatest();
  }

  getBookById(id: number): Promise<Book> {
    return this.bookRepository.findById(id);
  }
}
