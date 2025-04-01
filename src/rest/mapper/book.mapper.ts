import { BookDto, BookListDto } from '../dto/book.dto';
import { Book } from '../../database/model/book.entity';

class BookMapper {
  toBookListDto(entity: Book): BookListDto {
    return {
      id: entity.id,
      title: entity.title,
      createdAt: entity.createdAt,
    };
  }

  toBookListDtos(entities: Book[]): BookListDto[] {
    return entities.map((entity) => this.toBookListDto(entity));
  }

  toBookDto(entity: Book): BookDto {
    return {
      id: entity.id,
      title: entity.title,
      createdAt: entity.createdAt,
      genres: entity.genres,
    };
  }

  toBookDtos(entities: Book[]): BookDto[] {
    return entities.map((entity) => this.toBookDto(entity));
  }
}

export default new BookMapper();
