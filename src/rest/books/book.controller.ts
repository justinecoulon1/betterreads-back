import { Controller, Get, Param } from '@nestjs/common';
import { BookService } from './book.service';
import bookMapper from '../mapper/book.mapper';
import { BookDto, BookListDto } from '../dto/book.dto';

@Controller('/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('/latest')
  async getFiveLastBooks(): Promise<BookListDto[]> {
    return bookMapper.toBookListDtos(await this.bookService.getFiveLastBooks());
  }

  @Get('/:id')
  async getBookById(@Param('id') id: number): Promise<BookDto> {
    return bookMapper.toBookDto(await this.bookService.getBookById(id));
  }
}
