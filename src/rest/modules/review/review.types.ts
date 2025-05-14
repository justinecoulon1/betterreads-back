import { Review } from '../../../database/model/review.entity';

export type PaginatedReviews = {
  reviews: Review[];
  totalCount: number;
};
