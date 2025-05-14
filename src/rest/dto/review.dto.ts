import { UserDto } from './user.dto';
import { SmallBookDto } from './book.dto';

export type ReviewDto = {
  id: number;
  score: number;
  user: UserDto;
  commentary: string;
};

export type UserReviewDto = ReviewDto & {
  book: SmallBookDto;
};

export type BookReviewInfoDto = {
  averageScore: number;
  lastAddedReviews: ReviewDto[];
};

export type CreateReviewRequestDto = {
  score: number;
  commentary: string;
  bookId: number;
};
