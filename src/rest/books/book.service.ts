import { BadRequestException, Injectable } from '@nestjs/common';
import { BookRepository } from '../../database/book/book.repository';
import { Book } from '../../database/model/book.entity';
import { checkISBNValidity, generateISBN10, generateISBN13 } from '../isbn/isbn.service';

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

  createBook(title: string, releaseDate: Date, genres: string[], isbn: string): Promise<Book> {
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    const book = new Book(title, genres, releaseDate, '', '', new Date(), new Date());
    console.log(cleanISBN);
    if (/^\d{9}[\dX]$/.test(cleanISBN)) {
      book.isbn10 = isbn;
      book.isbn13 = generateISBN13(isbn);
    } else if (/^\d{13}$/.test(cleanISBN)) {
      book.isbn13 = isbn;
      book.isbn10 = generateISBN10(isbn);
    }

    return this.bookRepository.save(book);
  }
}
