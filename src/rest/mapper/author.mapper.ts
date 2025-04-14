import { Author } from '../../database/model/author.entity';
import { AuthorDto, AuthorWithBooksDto } from '../dto/author.dto';
import bookMapper from './book.mapper';

class AuthorMapper {
  toDto(entity: Author): AuthorDto {
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
    };
  }

  toDtos(entities: Author[]): AuthorDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  async toAuthorWithBooksDto(entity: Author): Promise<AuthorWithBooksDto> {
    return {
      ...this.toDto(entity),
      books: await bookMapper.toBookDtos((await entity.books) ?? []),
    };
  }

  async toAuthorWithBooksDtos(entities: Author[]): Promise<AuthorWithBooksDto[]> {
    return Promise.all(entities.map((entity) => this.toAuthorWithBooksDto(entity)));
  }
}

export default new AuthorMapper();
