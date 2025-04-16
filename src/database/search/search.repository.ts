import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Search } from '../model/search.entity';
import { SearchResult } from './search.repository.types';
import { SEARCH_QUERY } from './search.repository.queries';

@Injectable()
export class SearchRepository {
  private repository: Repository<Search>;

  constructor(
    @Inject('DATA_SOURCE')
    dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(Search);
  }

  findAll(): Promise<Search[]> {
    return this.repository.find();
  }

  async searchByText(text: string, limit: number, offset: number): Promise<SearchResult> {
    const queryParameters = { text, wildCardText: `%${text}%` };
    const [searchItems, count] = await this.repository
      .createQueryBuilder('s')
      .innerJoin('(' + SEARCH_QUERY + ')', 'similarity_data', 'similarity_data.search_id = s.id')
      .leftJoinAndSelect('s.book', 'book')
      .leftJoinAndSelect('s.author', 'author')
      .setParameters(queryParameters)
      .orderBy('similarity', 'DESC')
      .limit(limit)
      .offset(offset)
      .getManyAndCount();
    return { items: searchItems, count };
  }

  save(search: Search): Promise<Search> {
    return this.repository.save(search);
  }

  saveAll(searches: Search[]): Promise<Search[]> {
    return this.repository.save(searches);
  }
}
