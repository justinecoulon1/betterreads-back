import { UserDto } from 'src/rest/dto/user.dto';
import { User } from '../../database/model/user.entity';

class UserMapper {
  toDto(entity: User): UserDto {
    return {
      id: entity.id,
      name: entity.name,
    };
  }

  toDtos(entities: User[]): UserDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}

export default new UserMapper();
