import { UserDto } from './user.dto';

export type ReviewDto = {
  id: number;
  score: number;
  user: UserDto;
  commentary: string;
};

export type CreateReviewRequestDto = {
  score: number;
  commentary: string;
};
