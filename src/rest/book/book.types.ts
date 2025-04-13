import { Book } from '../../database/model/book.entity';
import { Shelf } from '../../database/model/shelf.entity';

export type UpdateBookInShelvesResponse = {
  book: Book;
  addedShelves: Shelf[];
  removedShelves: Shelf[];
};
