import { Injectable } from '@nestjs/common';
import { BookRepository } from '../../../database/book/book.repository';
import { Book } from '../../../database/model/book.entity';
import { IsbnService } from '../../utils/isbn/isbn.service';
import { Isbn, IsbnType } from '../../utils/isbn/isbn.types';
import { BookAlreadyExistsException, BookNotFoundException } from './book.exceptions';
import { CreateBookRequestDto, IsbnDbBookResponseDto, PreloadedBookInfoDto } from '../../dto/book.dto';
import axios from 'axios';
import { BookCoverService } from './book-cover.service';
import { AuthorService } from '../author/author.service';
import { AuthorRepository } from '../../../database/author/author.repository';
import { Author } from '../../../database/model/author.entity';
import { TransactionService } from '../../../database/utils/transaction/transaction.service';
import * as fs from 'node:fs';
import { InvalidIsbnException } from '../../utils/isbn/isbn.exceptions';
import { ShelfRepository } from '../../../database/shelf/shelf.repository';
import { Shelf, ShelfType } from '../../../database/model/shelf.entity';
import { UpdateBookInShelvesResponse } from './book.types';
import { SearchService } from '../search/search.service';

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
    private readonly shelfRepository: ShelfRepository,
    private readonly searchService: SearchService,
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

    const existingIsbn = await this.bookRepository.findByIsbn13(isbnPair.isbn13.value);
    if (existingIsbn) {
      throw new BookAlreadyExistsException();
    }

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

    return this.transactionService.wrapInTransaction(async () => {
      const createdAuthors = await this.authorRepository.saveAll(toCreateAuthors);
      await this.searchService.createAuthorsSearchData(createdAuthors);
      const bookAuthors = [...createdAuthors, ...existingAuthors];

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
      book.authors = Promise.resolve(bookAuthors);
      const createdBook = await this.bookRepository.save(book);
      await this.searchService.createBookSearchData(createdBook);
      return createdBook;
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

    let isbnDbBookResponseDto: IsbnDbBookResponseDto;
    try {
      const { data } = await axios.get<IsbnDbBookResponseDto>(`https://api2.isbndb.com/book/${isbn.value}`, {
        headers: {
          Authorization: this.isbnDbApiKey,
          'Content-Type': 'application/json',
        },
      });

      isbnDbBookResponseDto = data;
    } catch (err) {
      console.error(err);
      return { isbn13: isbn.value };
    }

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
      description: isbnDbBookDto.synopsis
        ?.replace(/<br>/g, '\n')
        ?.replace(/<br\/>/g, '\n')
        ?.replace(/<[a-zA-Z]+>/g, '')
        ?.replace(/<\/[a-zA-Z]+>/g, ''),
      editor: isbnDbBookDto.publisher,
      editionLanguage: isbnDbBookDto.language,
      releaseDate: isbnDbBookDto.date_published,
      pages: isbnDbBookDto.pages,
      title: isbnDbBookDto.title,
      authorNames: isbnDbBookDto.authors,
      genres: isbnDbBookDto.subjects,
      isbn13: isbn.value,
    };
  }

  getBookCoverImageStream(rawIsbn: string): fs.ReadStream {
    const isbn = this.isbnService.parseIsbn(rawIsbn);
    if (isbn.type !== IsbnType.ISBN_13) {
      throw new InvalidIsbnException();
    }
    return this.bookCoverService.getCoverStream(isbn.value);
  }

  async getBookReadingStatus(userId: number, bookId: number): Promise<ShelfType | undefined> {
    const readingStatusShelves = await this.shelfRepository.findByBookIdUserIdAndTypeIn(bookId, userId, [
      ShelfType.TO_READ,
      ShelfType.READING,
      ShelfType.READ,
    ]);
    if (readingStatusShelves.length === 0) {
      return undefined;
    }
    if (readingStatusShelves.length > 1) {
      console.warn(`User ${userId} has Book ${bookId} on multiple reading status shelves`);
    }
    return readingStatusShelves[0].type;
  }

  async updateBookReadingStatus(
    userId: number,
    bookId: number,
    statusType: ShelfType | undefined,
  ): Promise<ShelfType | undefined> {
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new BookNotFoundException();
    }

    return this.transactionService.wrapInTransaction(async () => {
      const readingShelfTypes = [ShelfType.TO_READ, ShelfType.READING, ShelfType.READ];

      const [existingShelves, userShelves] = await Promise.all([
        this.shelfRepository.findByBookIdUserIdAndTypeIn(bookId, userId, readingShelfTypes),
        this.shelfRepository.findByUserIdAndTypeIn(userId, readingShelfTypes),
      ]);

      const currentShelf = existingShelves[0];
      const newShelf = userShelves.find((shelf) => shelf.type === statusType);

      const currentShelves = await book.shelves;

      if (!currentShelf && newShelf) {
        newShelf.updatedAt = new Date();
        book.shelves = Promise.resolve([...currentShelves, newShelf]);
        const savedBook = await this.bookRepository.save(book);
        return this.getBookReadingStatus(userId, savedBook.id);
      }

      if (currentShelf && newShelf) {
        newShelf.updatedAt = new Date();
        const updatedShelves = currentShelves.filter((shelf) => shelf.id !== currentShelf.id);
        book.shelves = Promise.resolve([...updatedShelves, newShelf]);
        const savedBook = await this.bookRepository.save(book);
        return this.getBookReadingStatus(userId, savedBook.id);
      }

      return undefined;
    });
  }

  async updateBookInShelves(
    userId: number,
    bookId: number,
    shelvesToAddIds: number[],
    shelvesToDeleteIds: number[],
  ): Promise<UpdateBookInShelvesResponse> {
    const book = await this.getBookById(bookId);
    if (!book) {
      throw new BookNotFoundException();
    }

    const toAddShelves = await this.shelfRepository.findUserShelvesByIds(shelvesToAddIds, userId);
    const toDeleteShelves = await this.shelfRepository.findUserShelvesByIds(shelvesToDeleteIds, userId);

    return this.transactionService.wrapInTransaction(async () => {
      const addedShelves = await this.addBookToShelves(toAddShelves, book);
      const removedShelves = await this.removeBookFromShelves(toDeleteShelves, book);

      return { book, addedShelves, removedShelves };
    });
  }

  private async addBookToShelves(shelves: Shelf[], book: Book): Promise<Shelf[]> {
    for (const shelf of shelves) {
      (await shelf.books).push(book);
      shelf.updatedAt = new Date();
    }
    return this.shelfRepository.saveAll(shelves);
  }

  private async removeBookFromShelves(shelves: Shelf[], book: Book): Promise<Shelf[]> {
    for (const shelf of shelves) {
      const updatedBooks = (await shelf.books).filter((b) => b.id !== book.id);
      shelf.books = Promise.resolve(updatedBooks);
      shelf.updatedAt = new Date();
    }
    return this.shelfRepository.saveAll(shelves);
  }
}
