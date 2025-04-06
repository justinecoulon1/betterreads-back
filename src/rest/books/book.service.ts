import { Injectable } from '@nestjs/common';
import { BookRepository } from '../../database/book/book.repository';
import { Book } from '../../database/model/book.entity';
import { IsbnService } from '../utils/isbn/isbn.service';
import { Isbn, IsbnType } from '../utils/isbn/isbn.types';
import { BookAlreadyExistsException, BookNotFoundException } from './book.exceptions';
import { CreateBookRequestDto, IsbnDbBookResponseDto, PreloadedBookInfoDto } from '../dto/book.dto';
import axios from 'axios';
import { BookCoverService } from './book-cover.service';

@Injectable()
export class BookService {
  private isbnDbApiKey = process.env.ISBNDB_API_KEY;

  constructor(
    private readonly bookRepository: BookRepository,
    private readonly isbnService: IsbnService,
    private readonly bookCoverService: BookCoverService,
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

  createBook(createBookRequestDto: CreateBookRequestDto): Promise<Book> {
    const {
      title,
      releaseDate,
      genres,
      isbn: rawIsbn,
      editor,
      editionLanguage,
      authorsName,
      description,
    } = createBookRequestDto;
    const isbn = this.isbnService.parseIsbn(rawIsbn);
    const isbnPair = this.isbnService.getIsbnPair(isbn);
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
    return this.bookRepository.save(book);
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
      return {};
    }

    let existingCoverImage = this.bookCoverService.getCoverBase64(isbn.value);
    if (!existingCoverImage && isbnDbBookDto.image) {
      const { data: newImageData } = await axios.get<string>(isbnDbBookDto.image, {
        responseType: 'arraybuffer',
      });
      this.bookCoverService.saveCover(isbn.value, Buffer.from(newImageData, 'binary'));
      existingCoverImage = this.bookCoverService.getCoverBase64(isbn.value);
    }
    return {
      description: isbnDbBookDto.synopsis?.replace(/<br>/g, '\n')?.replace(/<br\/>/g, '\n'),
      coverImage: existingCoverImage,
      editor: isbnDbBookDto.publisher,
      editionLanguage: isbnDbBookDto.language,
      releaseDate: isbnDbBookDto.date_published,
      pages: isbnDbBookDto.pages,
      title: isbnDbBookDto.title,
      authorNames: isbnDbBookDto.authors,
    };
  }
}
