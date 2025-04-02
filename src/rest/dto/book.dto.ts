import { AuthorDto } from './author.dto';

export type BookListDto = {
  id: number;
  title: string;
  authors: AuthorDto[];
  createdAt: Date;
};

export type BookDto = {
  id: number;
  title: string;
  createdAt: Date;
  genres: string[];
  authors: AuthorDto[];
  releaseDate: Date;
};
