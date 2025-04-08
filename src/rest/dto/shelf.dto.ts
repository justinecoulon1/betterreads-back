import { ShelfType } from '../../database/model/shelf.entity';

export type ShelfDto = {
  id: number;
  name: string;
  createdAt: Date;
  type: ShelfType;
};

export type CreateShelfRequestDto = {
  name: string;
};
