import { BookDto, BookListDto } from '../dto/book.dto';
import { Book } from '../../database/model/book.entity';
import authorMapper from './author.mapper';

class BookMapper {
  async toBookListDto(entity: Book): Promise<BookListDto> {
    return {
      id: entity.id,
      title: entity.title,
      createdAt: entity.createdAt,
      authors: authorMapper.toDtos(await entity.authors),
    };
  }

  toBookListDtos(entities: Book[]): Promise<BookListDto[]> {
    return Promise.all(entities.map((entity) => this.toBookListDto(entity)));
  }

  async toBookDto(entity: Book): Promise<BookDto> {
    return {
      id: entity.id,
      title: entity.title,
      createdAt: entity.createdAt,
      genres: entity.genres,
      authors: authorMapper.toDtos(await entity.authors),
    };
  }

  toBookDtos(entities: Book[]): Promise<BookDto[]> {
    return Promise.all(entities.map((entity) => this.toBookDto(entity)));
  }
}

export default new BookMapper();
