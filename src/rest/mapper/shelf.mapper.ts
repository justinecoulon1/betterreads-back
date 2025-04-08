import { Shelf } from '../../database/model/shelf.entity';
import { ShelfDto } from '../dto/shelf.dto';

class ShelfMapper {
  toDto(entity: Shelf): ShelfDto {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      type: entity.type,
    };
  }

  toDtos(entities: Shelf[]): ShelfDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}

export default new ShelfMapper();
