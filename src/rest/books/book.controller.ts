import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookService } from './book.service';
import bookMapper from '../mapper/book.mapper';
import { BookDto, BookListDto, CreateBookRequestDto, PreloadedBookInfoDto } from '../dto/book.dto';

@Controller('/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('/latest')
  async getLatestBooks(): Promise<BookListDto[]> {
    return bookMapper.toBookListDtos(await this.bookService.getLatestBooks());
  }

  @Get('/:id')
  async getBookById(@Param('id') id: number): Promise<BookDto> {
    return bookMapper.toBookDto(await this.bookService.getBookById(id));
  }

  @Get('/preload/:isbn')
  async preloadBookInfo(@Param('isbn') isbn: string): Promise<PreloadedBookInfoDto> {
    return this.bookService.getPreloadedBookInfoDto(isbn);
  }

  @Post('/')
  async createBook(@Body() createBookRequestDto: CreateBookRequestDto): Promise<BookDto> {
    return bookMapper.toBookDto(await this.bookService.createBook(createBookRequestDto));
  }
}
