import { Injectable, NotFoundException } from '@nestjs/common';
import { BookRepository } from '../../database/book/book.repository';
import { Book } from '../../database/model/book.entity';
import { IsbnService } from '../utils/isbn/isbn.service';
import { Isbn, IsbnType } from '../utils/isbn/isbn.types';
import { BookAlreadyExistsException, BookNotFoundException } from './book.exceptions';
import { CreateBookRequestDto, IsbnDbBookResponseDto, PreloadedBookInfoDto } from '../dto/book.dto';
import axios from 'axios';
import { BookCoverService } from './book-cover.service';
import { AuthorService } from '../author/author.service';
import { AuthorRepository } from '../../database/author/author.repository';
import { Author } from '../../database/model/author.entity';
import { TransactionService } from '../../database/utils/transaction/transaction.service';
import * as fs from 'node:fs';
import { InvalidIsbnException } from '../utils/isbn/isbn.exceptions';

@Injectable()
export class BookService {
  private isbnDbApiKey = process.env.ISBNDB_API_KEY;

  constructor(
    private readonly bookRepository: BookRepository,
    private readonly isbnService: IsbnService,
    private readonly bookCoverService: BookCoverService,
    private readonly authorService: AuthorService,
    private readonly authorRepository: AuthorRepository,
    private readonly transactionService: TransactionService,
  ) {}

  getLatestBooks(): Promise<Book[]> {
    return this.bookRepository.findLatest();
  }

  async getBookById(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new BookNotFoundException();
    }
    return book;
  }

  async getBookByIsbn(isbn: Isbn): Promise<Book | null> {
    if (isbn.type === IsbnType.ISBN_10) {
      return this.bookRepository.findByIsbn10(isbn.value);
    }
    if (isbn.type === IsbnType.ISBN_13) {
      return this.bookRepository.findByIsbn13(isbn.value);
    }
    return null;
  }

  async createBook(createBookRequestDto: CreateBookRequestDto): Promise<Book> {
    const {
      title,
      releaseDate,
      genres,
      isbn: rawIsbn,
      editor,
      editionLanguage,
      authorNames,
      description,
    } = createBookRequestDto;
    const isbn = this.isbnService.parseIsbn(rawIsbn);
    const isbnPair = this.isbnService.getIsbnPair(isbn);

    const authorSlugByName: Record<string, string> = {};
    authorNames.forEach((authorName) => (authorSlugByName[authorName] = this.authorService.getAuthorSlug(authorName)));
    const existingAuthors = await this.authorRepository.findBySlugs(Object.values(authorSlugByName));

    const existingAuthorBySlug: Record<string, Author> = {};
    existingAuthors.forEach((existingAuthor) => (existingAuthorBySlug[existingAuthor.slug] = existingAuthor));

    const toCreateAuthorNames = authorNames.filter((authorName) => {
      const slug = authorSlugByName[authorName];
      const existingAuthor = existingAuthorBySlug[slug];
      return !existingAuthor;
    });

    const toCreateAuthors = toCreateAuthorNames.map(
      (toCreateAuthorName) =>
        new Author(toCreateAuthorName, authorSlugByName[toCreateAuthorName], new Date(), new Date()),
    );

    const bookAuthors = [...toCreateAuthors, ...existingAuthors];

    return this.transactionService.wrapInTransaction(async () => {
      const savedBookAuthors = await this.authorRepository.saveAll(bookAuthors);

      const book = new Book(
        title,
        genres,
        releaseDate,
        editor,
        editionLanguage,
        isbnPair.isbn10.value,
        isbnPair.isbn13.value,
        new Date(),
        new Date(),
        description,
      );
      book.authors = Promise.resolve(savedBookAuthors);
      return this.bookRepository.save(book);
    });
  }

  async getPreloadedBookInfoDto(rawIsbn: string): Promise<PreloadedBookInfoDto> {
    let isbn = this.isbnService.parseIsbn(rawIsbn);
    if (isbn.type !== IsbnType.ISBN_13) {
      isbn = this.isbnService.getIsbnPair(isbn).isbn13;
    }

    const book = await this.getBookByIsbn(isbn);
    if (book) {
      throw new BookAlreadyExistsException();
    }

    const { data: isbnDbBookResponseDto } = await axios.get<IsbnDbBookResponseDto>(
      `https://api2.isbndb.com/book/${isbn.value}`,
      {
        headers: {
          Authorization: this.isbnDbApiKey,
          'Content-Type': 'application/json',
        },
      },
    );

    const isbnDbBookDto = isbnDbBookResponseDto.book;
    if (!isbnDbBookDto) {
      return { isbn13: isbn.value };
    }

    if (!this.bookCoverService.exists(isbn.value) && isbnDbBookDto.image) {
      const { data: newImageData } = await axios.get<Buffer>(isbnDbBookDto.image, {
        responseType: 'arraybuffer',
      });
      this.bookCoverService.saveCover(isbn.value, newImageData);
    }
    return {
      description: isbnDbBookDto.synopsis?.replace(/<br>/g, '\n')?.replace(/<br\/>/g, '\n'),
      editor: isbnDbBookDto.publisher,
      editionLanguage: isbnDbBookDto.language,
      releaseDate: isbnDbBookDto.date_published,
      pages: isbnDbBookDto.pages,
      title: isbnDbBookDto.title,
      authorNames: isbnDbBookDto.authors,
      isbn13: isbn.value,
    };
  }

  getBookCoverImageStream(rawIsbn: string): fs.ReadStream {
    const isbn = this.isbnService.parseIsbn(rawIsbn);
    if (isbn.type !== IsbnType.ISBN_13) {
      throw new InvalidIsbnException();
    }
    const readStream = this.bookCoverService.getCoverStream(isbn.value);
    if (!readStream) {
      throw new NotFoundException();
    }
    return readStream;
  }
}
