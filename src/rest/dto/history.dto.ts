import { HistoryStatus } from '../../database/model/history.entity';
import { BookDto } from './book.dto';

export type HistoryDto = {
  id: number;
  createdAt: Date;
  oldStatus: HistoryStatus;
  newStatus: HistoryStatus;
  book: BookDto;
};

export type PaginatedHistoryDto = {
  histories: HistoryDto[];
  totalCount: number;
};
