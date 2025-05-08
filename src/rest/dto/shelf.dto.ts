import { ShelfType } from '../../database/model/shelf.entity';
import { BookDto, SmallBookDto } from './book.dto';

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
  books: SmallBookDto[];
};

export type CreateShelfRequestDto = {
  name: string;
};

export type UpdateShelfNameRequestDto = {
  name: string;
};
