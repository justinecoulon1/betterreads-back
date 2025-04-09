import { Shelf } from '../../database/model/shelf.entity';
import { ShelfDto, SmallShelfDto } from '../dto/smallShelfDto';
import bookMapper from './book.mapper';

class ShelfMapper {
  toSmallDto(entity: Shelf): SmallShelfDto {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      type: entity.type,
    };
  }

  toSmallDtos(entities: Shelf[]): SmallShelfDto[] {
    return entities.map((entity) => this.toSmallDto(entity));
  }

  async toDto(entity: Shelf): Promise<ShelfDto> {
    return {
      ...this.toSmallDto(entity),
      books: await bookMapper.toBookDtos(await entity.books),
    };
  }

  toDtos(entities: Shelf[]): Promise<ShelfDto[]> {
    const dtoPromises = entities.map((entity) => this.toDto(entity));
    return Promise.all(dtoPromises);
  }
}

export default new ShelfMapper();
