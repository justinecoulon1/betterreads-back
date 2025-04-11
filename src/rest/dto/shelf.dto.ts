import { ShelfType } from '../../database/model/shelf.entity';
import { BookDto, BookListDto } from './book.dto';

export type SmallShelfDto = {
  id: number;
  name: string;
  createdAt: Date;
  type: ShelfType;
};

export type ShelfDto = SmallShelfDto & {
  books: BookDto[];
};

export type ShelfWithLastBookDto = SmallShelfDto & {
  books: BookListDto[];
};

export type CreateShelfRequestDto = {
  name: string;
};
