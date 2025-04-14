import { Controller, Get, ParseIntPipe, Query, Req } from '@nestjs/common';
import { HistoryService } from './history.service';
import { Role } from '../../utils/roles/roles.decorator';
import { BetterreadsRequest } from '../../utils/http/betterreads-request';
import historyMapper from '../../mapper/history.mapper';
import { PaginatedHistoryDto } from '../../dto/history.dto';

@Controller('/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Role('user')
  @Get()
  async getUserHistory(
    @Req() req: BetterreadsRequest,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<PaginatedHistoryDto> {
    const result = await this.historyService.getHistoryByUserId(req.user.id, limit, offset);
    return { histories: await historyMapper.toDtos(result.histories), totalCount: result.totalCount };
  }
}
