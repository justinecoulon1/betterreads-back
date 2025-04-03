import { AuthorDto } from './author.dto';

export type BookListDto = {
  id: number;
  title: string;
  authors: AuthorDto[];
};

export type BookDto = {
  id: number;
  title: string;
  createdAt: Date;
  genres: string[];
  authors: AuthorDto[];
  isbn10: string;
  isbn13: string;
  releaseDate: Date;
};
