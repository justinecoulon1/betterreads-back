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
  async getBookById(@Param('id', ParseIntPipe) id: number): Promise<BookDto> {
    return bookMapper.toBookDto(await this.bookService.getBookById(id));
  }

  @Get('/isbn/:isbn')
  async getBookByIsbn(@Param('isbn') rawIsbn: string): Promise<BookDto> {
    const isbn = this.isbnService.parseIsbn(rawIsbn);
    return bookMapper.toBookDto(await this.bookService.getBookByIsbn(isbn));
  }

  @Role('user')
  @Get('/preload/:isbn')
  async preloadBookInfo(@Param('isbn') isbn: string): Promise<PreloadedBookInfoDto> {
    return this.bookService.getPreloadedBookInfoDto(isbn);
  }

  @Role('user')
  @Post('/')
  async createBook(@Body() createBookRequestDto: CreateBookRequestDto): Promise<BookDto> {
    return bookMapper.toBookDto(await this.bookService.createBook(createBookRequestDto));
  }

  @Get('/cover/:isbn')
  getBookCoverImage(@Param('isbn') isbn: string, @Res() res: Response) {
    const fileStream = this.bookService.getBookCoverImageStream(isbn);
    fileStream.pipe(res);
  }

  @Role('user')
  @Get('/status/:bookId')
  getBookReadingStatus(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Req() req: BetterreadsRequest,
  ): Promise<ShelfType | undefined> {
    return this.bookService.getBookReadingStatus(req.user.id, bookId);
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

  @Role('user')
  @Post('/update-reading-status')
  async updateBookReadingStatus(
    @Req() req: BetterreadsRequest,
    @Body() updateBookReadingStatusRequestDto: UpdateBookReadingStatusRequestDto,
  ): Promise<ShelfType | undefined> {
    return this.bookService.updateBookReadingStatus(
      req.user.id,
      updateBookReadingStatusRequestDto.bookId,
      updateBookReadingStatusRequestDto.statusType,
    );
  }
}
