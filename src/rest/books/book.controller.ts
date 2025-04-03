import { Controller, Get, Param } from '@nestjs/common';
import { BookService } from './book.service';
import bookMapper from '../mapper/book.mapper';
import { BookDto, BookListDto } from '../dto/book.dto';

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

  @Get('/isbn/:isbn')
  async checkBookIsbn(@Param('isbn') isbn: string): Promise<boolean> {
    return await this.bookService.checkBookExists(isbn);
  }

  //
  // @Post('/:isbn')
  // async createBook(@Param('isbn') isbn: string): Promise<BookDto> {
  //   return bookMapper.toBookDto(await this.bookService.createBook(isbn));
  // }
}
