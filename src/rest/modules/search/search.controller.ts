import { Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchResultDto } from '../../dto/search.dto';
import SearchMapper from '../../mapper/search.mapper';

@Controller('/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('/init')
  initSearchData() {
    return this.searchService.initSearchData();
  }

  @Get()
  async getPaginatedSearchData(
    @Query('text') text: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<SearchResultDto> {
    const searchResult = await this.searchService.getPaginatedSearchData(text, limit, offset);
    return {
      items: await SearchMapper.toSearchDtos(searchResult.items),
      count: searchResult.count,
      limit,
      offset,
    };
  }
}
