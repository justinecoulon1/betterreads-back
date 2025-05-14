import { Review } from '../../database/model/review.entity';
import { ReviewDto, UserReviewDto } from '../dto/review.dto';
import userMapper from './user.mapper';
import bookMapper from './book.mapper';

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

  async toUserDto(entity: Review): Promise<UserReviewDto> {
    return {
      id: entity.id,
      commentary: entity.commentary,
      score: entity.score,
      user: userMapper.toDto(await entity.user),
      book: await bookMapper.toSmallBookDto(await entity.book),
    };
  }

  toUserDtos(entities: Review[]): Promise<UserReviewDto[]> {
    const dtoPromises = entities.map((entity) => this.toUserDto(entity));
    return Promise.all(dtoPromises);
  }
}

export default new ReviewMapper();
