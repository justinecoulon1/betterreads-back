import { Search } from '../model/search.entity';

export type SearchResult = {
  items: Search[];
  count: number;
};
