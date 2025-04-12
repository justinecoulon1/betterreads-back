import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Res } from '@nestjs/common';
import { BookService } from './book.service';
import bookMapper from '../mapper/book.mapper';
import {
  AddBookToShelvesRequestDto,
  BookDto,
  BookListDto,
  CreateBookRequestDto,
  PreloadedBookInfoDto,
  UpdateBookReadingStatusRequestDto,
} from '../dto/book.dto';
import { Response } from 'express';
import { IsbnService } from '../utils/isbn/isbn.service';
import { ShelfType } from '../../database/model/shelf.entity';
import { BetterreadsRequest } from '../utils/http/betterreads-request';
import { Role } from '../utils/roles/roles.decorator';

@Controller('/books')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly isbnService: IsbnService,
  ) {}

  @Get('/latest')
  async getLatestBooks(): Promise<BookListDto[]> {
    return bookMapper.toBookListDtos(await this.bookService.getLatestBooks());
  }

  @Get('/:id')
  async getBookById(@Param('id') id: number): Promise<BookDto> {
    return bookMapper.toBookDto(await this.bookService.getBookById(id));
  }

  @Get('/isbn/:isbn')
  async getBookByIsbn(@Param('isbn') rawIsbn: string): Promise<BookDto> {
    const isbn = this.isbnService.parseIsbn(rawIsbn);
    return bookMapper.toBookDto(await this.bookService.getBookByIsbn(isbn));
  }

  @Get('/preload/:isbn')
  async preloadBookInfo(@Param('isbn') isbn: string): Promise<PreloadedBookInfoDto> {
    return this.bookService.getPreloadedBookInfoDto(isbn);
  }

  @Post('/')
  async createBook(@Body() createBookRequestDto: CreateBookRequestDto): Promise<BookDto> {
    return bookMapper.toBookDto(await this.bookService.createBook(createBookRequestDto));
  }

  @Get('/cover/:isbn')
  getBookCoverImage(@Param('isbn') isbn: string, @Res() res: Response) {
    const fileStream = this.bookService.getBookCoverImageStream(isbn);
    fileStream.pipe(res);
  }

  @Get('/status/:userId/:bookId')
  getBookReadingStatus(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ): Promise<ShelfType | undefined> {
    return this.bookService.getBookReadingStatus(userId, bookId);
  }

  @Role('user')
  @Post('/add')
  async addBookToShelves(
    @Body() addBookToShelvesRequestDto: AddBookToShelvesRequestDto,
    @Req() req: BetterreadsRequest,
  ): Promise<BookDto> {
    return bookMapper.toBookDto(
      await this.bookService.addBookToShelves(
        req.user.id,
        addBookToShelvesRequestDto.isbn,
        addBookToShelvesRequestDto.shelvesId,
      ),
    );
  }

  @Post('/update-reading-status/:userId')
  async updateBookReadingStatus(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateBookReadingStatusRequestDto: UpdateBookReadingStatusRequestDto,
  ): Promise<ShelfType | undefined> {
    return this.bookService.updateBookReadingStatus(
      userId,
      updateBookReadingStatusRequestDto.bookId,
      updateBookReadingStatusRequestDto.statusType,
    );
  }
}
