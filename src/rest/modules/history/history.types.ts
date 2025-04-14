import { History } from '../../../database/model/history.entity';

export type PaginatedHistory = {
  histories: History[];
  totalCount: number;
};
