import { Review } from '../../database/model/review.entity';
import { ReviewDto } from '../dto/review.dto';
import userMapper from './user.mapper';

class ReviewMapper {
  async toDto(entity: Review): Promise<ReviewDto> {
    return {
      id: entity.id,
      commentary: entity.commentary,
      score: entity.score,
      user: userMapper.toDto(await entity.user),
    };
  }

  toDtos(entities: Review[]): Promise<ReviewDto[]> {
    const dtoPromises = entities.map((entity) => this.toDto(entity));
    return Promise.all(dtoPromises);
  }
}

export default new ReviewMapper();
