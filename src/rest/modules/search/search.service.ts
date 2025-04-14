import { Injectable } from '@nestjs/common';
import { SearchRepository } from '../../../database/search/search.repository';
import { BookRepository } from '../../../database/book/book.repository';
import { AuthorRepository } from '../../../database/author/author.repository';
import { Search, SearchType } from '../../../database/model/search.entity';
import { Book } from '../../../database/model/book.entity';
import { Author } from '../../../database/model/author.entity';
import { SearchResult } from './search.types';

@Injectable()
export class SearchService {
  constructor(
    private readonly searchRepository: SearchRepository,
    private readonly bookRepository: BookRepository,
    private readonly authorsRepository: AuthorRepository,
  ) {}

  async getPaginatedSearchData(text: string, limit: number, offset: number): Promise<SearchResult> {
    if (!text || text.length < 2) {
      return { count: 0, items: [] };
    }
    const searchResult = await this.searchRepository.searchByText(text, limit, offset);
    return {
      count: searchResult.count,
      items: searchResult.searchItems,
    };
  }

  createAuthorsSearchData(authors: Author[]): Promise<Search[]> {
    const searchItems = authors.map(
      (author) => new Search(author.name, SearchType.AUTHOR, new Date(), new Date(), undefined, author),
    );
    return this.searchRepository.saveAll(searchItems);
  }

  async createBookSearchData(book: Book): Promise<Search[]> {
    const searchItems = [
      new Search(book.title, SearchType.BOOK_TITLE, new Date(), new Date(), book),
      ...(await book.authors).map(
        (author) => new Search(author.name, SearchType.BOOK_AUTHOR, new Date(), new Date(), book),
      ),
    ];
    return this.searchRepository.saveAll(searchItems);
  }

  async initSearchData() {
    const [books, authors] = await Promise.all([this.bookRepository.findAll(), this.authorsRepository.findAll()]);
    const searchItems = (
      await Promise.all(
        books.map(async (book) => [
          new Search(book.title, SearchType.BOOK_TITLE, new Date(), new Date(), book),
          ...(await book.authors).map(
            (author) => new Search(author.name, SearchType.BOOK_AUTHOR, new Date(), new Date(), book),
          ),
        ]),
      )
    ).flat();
    searchItems.push(
      ...authors.map((author) => new Search(author.name, SearchType.AUTHOR, new Date(), new Date(), undefined, author)),
    );
    await this.searchRepository.saveAll(searchItems);
  }
}
