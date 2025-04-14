import { BookDto } from './book.dto';

export type AuthorDto = {
  id: number;
  name: string;
  slug: string;
};

export type AuthorWithBookCountDto = AuthorDto & {
  bookCount: number;
};

export type AuthorWithBooksDto = AuthorDto & {
  books: BookDto[];
};

export type CreateAuthorRequestDto = {
  name: string;
};
