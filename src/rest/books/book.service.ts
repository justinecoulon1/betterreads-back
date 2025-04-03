import { BadRequestException, Injectable } from '@nestjs/common';
import { BookRepository } from '../../database/book/book.repository';
import { Book } from '../../database/model/book.entity';
import { checkISBNValidity } from '../isbn/isbn.service';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  getLatestBooks(): Promise<Book[]> {
    return this.bookRepository.findLatest();
  }

  getBookById(id: number): Promise<Book> {
    return this.bookRepository.findById(id);
  }

  async checkBookExists(isbn: string): Promise<boolean> {
    const cleanISBN = isbn.replace(/[-\s]/g, '');

    if (/^\d{9}[\dX]$/.test(cleanISBN)) {
      const isValid = checkISBNValidity(cleanISBN, 'isbn10');
      if (!isValid) {
        throw new BadRequestException('Invalid ISBN');
      }

      const existingBook = await this.bookRepository.findByIsbn10(isbn);
      if (existingBook) {
        return true;
      }
    } else if (/^\d{13}$/.test(cleanISBN)) {
      const isValid = checkISBNValidity(cleanISBN, 'isbn13');
      if (!isValid) {
        throw new BadRequestException('Invalid ISBN');
      }

      const existingBook = await this.bookRepository.findByIsbn13(isbn);
      if (existingBook) {
        return true;
      }
    } else {
      throw new BadRequestException('Invalid ISBN format');
    }

    return false;
  }
}
