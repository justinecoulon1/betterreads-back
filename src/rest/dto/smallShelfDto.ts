import { ShelfType } from '../../database/model/shelf.entity';
import { BookDto } from './book.dto';

export type SmallShelfDto = {
  id: number;
  name: string;
  createdAt: Date;
  type: ShelfType;
};

export type ShelfDto = SmallShelfDto & {
  books: BookDto[];
};

export type CreateShelfRequestDto = {
  name: string;
};
