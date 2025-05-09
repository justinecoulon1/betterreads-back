import { AuthorDto } from './author.dto';
import { ShelfType } from '../../database/model/shelf.entity';
import { SmallShelfDto } from './shelf.dto';

export type SmallBookDto = {
  id: number;
  title: string;
  isbn13: string;
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
  isbn13: string;
  description?: string;
  pages?: number;
  releaseDate?: string;
  authorNames?: string[];
  title?: string;
  editionLanguage?: string;
  genres?: string[];
  editor?: string;
};

export type IsbnDbBookResponseDto = {
  book?: {
    synopsis?: string;
    pages?: number;
    image?: string;
    date_published?: string;
    authors?: string[];
    subjects?: string[];
    title?: string;
    language?: string;
    publisher?: string;
  };
};

export type UpdateBookInShelvesRequestDto = {
  bookId: number;
  shelvesToAddIds: number[];
  shelvesToDeleteIds: number[];
};

export type UpdateBookInShelvesResponseDto = {
  isbn: string;
  addedShelves: SmallShelfDto[];
  removedShelves: SmallShelfDto[];
};

export type UpdateBookReadingStatusRequestDto = {
  bookId: number;
  statusType: ShelfType | undefined;
};
