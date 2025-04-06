import { Author } from '../../database/model/author.entity';
import { AuthorDto } from '../dto/author.dto';

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
}

export default new AuthorMapper();
