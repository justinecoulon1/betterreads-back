import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Search } from '../model/search.entity';

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

  async searchByText(text: string, limit: number, offset: number) {
    const [searchItems, count] = await this.repository
      .createQueryBuilder('search')
      .leftJoinAndSelect('search.book', 'book')
      .leftJoinAndSelect('search.author', 'author')
      .where('text ILIKE :wildcardText OR word_similarity(search.text, :text) > 0.15', {
        wildcardText: `%${text}%`,
        text,
      })
      .orderBy('word_similarity(search.text, :text)', 'DESC')
      .limit(limit)
      .offset(offset)
      .getManyAndCount();
    return { searchItems, count };
  }

  save(search: Search): Promise<Search> {
    return this.repository.save(search);
  }

  saveAll(searches: Search[]): Promise<Search[]> {
    return this.repository.save(searches);
  }
}
