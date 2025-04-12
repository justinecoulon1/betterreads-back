import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { ShelfService } from './shelf.service';
import shelfMapper from '../mapper/shelf.mapper';
import { CreateShelfRequestDto, ShelfDto, ShelfWithLastBookDto, SmallShelfDto } from '../dto/shelf.dto';
import { ShelfType } from '../../database/model/shelf.entity';
import { Role } from '../utils/roles/roles.decorator';
import { BetterreadsRequest } from '../utils/http/betterreads-request';

@Controller('/shelves')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @Role('user')
  @Get('/all')
  async getAll(): Promise<SmallShelfDto[]> {
    return shelfMapper.toSmallDtos(await this.shelfService.getAllShelves());
  }

  @Role('user')
  @Get()
  async getUserShelves(@Req() req: BetterreadsRequest): Promise<ShelfWithLastBookDto[]> {
    return shelfMapper.toShelfWithLastBooksDtos(await this.shelfService.getUserShelves(req.user.id));
  }

  @Role('user')
  @Get('/containing-book/:bookId')
  async getUserShelvesContainingBook(
    @Req() req: BetterreadsRequest,
    @Param('bookId', ParseIntPipe) bookId: number,
  ): Promise<SmallShelfDto[]> {
    return shelfMapper.toShelfWithLastBooksDtos(
      await this.shelfService.getUserShelvesContainingBook(req.user.id, bookId),
    );
  }

  @Role('user')
  @Get('/status-shelves')
  async getUserReadingStatusShelves(@Req() req: BetterreadsRequest): Promise<ShelfWithLastBookDto[]> {
    return shelfMapper.toShelfWithLastBooksDtos(await this.shelfService.getUserReadingStatusShelves(req.user.id));
  }

  @Role('user')
  @Get('/latest')
  async getLastUserShelves(@Req() req: BetterreadsRequest): Promise<ShelfWithLastBookDto[]> {
    return shelfMapper.toShelfWithLastBooksDtos(await this.shelfService.getUserShelves(req.user.id, 5));
  }

  @Role('user')
  @Post()
  async createShelf(
    @Req() req: BetterreadsRequest,
    @Body() createShelfDto: CreateShelfRequestDto,
  ): Promise<ShelfWithLastBookDto[]> {
    return shelfMapper.toShelfWithLastBooksDtos(
      await this.shelfService.createShelf(createShelfDto.name, ShelfType.USER, req.user),
    );
  }

  @Role('user')
  @Get('/:shelfId')
  async getShelfById(
    @Req() req: BetterreadsRequest,
    @Param('shelfId', ParseIntPipe) shelfId: number,
  ): Promise<ShelfDto> {
    return shelfMapper.toDto(await this.shelfService.getShelfById(req.user.id, shelfId));
  }

  @Role('user')
  @Delete('/:shelfId')
  async removeShelf(
    @Req() req: BetterreadsRequest,
    @Param('shelfId', ParseIntPipe) shelfId: number,
  ): Promise<SmallShelfDto> {
    return shelfMapper.toSmallDto(await this.shelfService.removeShelf(req.user.id, shelfId));
  }
}
