import { AuthorDto } from './author.dto';

export type BookListDto = {
  id: number;
  title: string;
  isbn: string;
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
  editor: string;
  editionLanguage: string;
  description?: string;
};

export type CreateBookRequestDto = {
  title: string;
  releaseDate: Date;
  genres: string[];
  isbn: string;
  editor: string;
  editionLanguage: string;
  description?: string;
  authorNames: string[];
};

export type PreloadedBookInfoDto = {
  description?: string;
  pages?: number;
  releaseDate?: string;
  authorNames?: string[];
  title?: string;
  editionLanguage?: string;
  editor?: string;
};

export type IsbnDbBookResponseDto = {
  book?: {
    synopsis?: string;
    pages?: number;
    image?: string;
    date_published?: string;
    authors?: string[];
    title?: string;
    language?: string;
    publisher?: string;
  };
};
