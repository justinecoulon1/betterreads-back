import { Search } from '../../../database/model/search.entity';

export type SearchResult = {
  items: Search[];
  count: number;
};
