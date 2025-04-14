import { SearchType } from '../../database/model/search.entity';
import { AuthorDto } from './author.dto';
import { BookDto } from './book.dto';

export type SearchResultDto = {
  items: SearchDto[];
  count: number;
  limit: number;
  offset: number;
};

export type SearchDto = {
  searchType: SearchType;
  book?: BookDto;
  author?: AuthorDto;
};
