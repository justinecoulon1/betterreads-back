import { SearchDto } from '../dto/search.dto';
import AuthorMapper from './author.mapper';
import BookMapper from './book.mapper';
import { Search } from '../../database/model/search.entity';

class SearchMapper {
  async toSearchDto(entity: Search): Promise<SearchDto> {
    return {
      searchType: entity.searchType,
      author: (await entity.author) ? AuthorMapper.toDto(await entity.author) : undefined,
      book: (await entity.book) ? await BookMapper.toBookDto(await entity.book) : undefined,
    };
  }

  toSearchDtos(entities: Search[]): Promise<SearchDto[]> {
    return Promise.all(entities.map((entity) => this.toSearchDto(entity)));
  }
}

export default new SearchMapper();
