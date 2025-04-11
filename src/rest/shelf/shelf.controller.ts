import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ShelfService } from './shelf.service';
import shelfMapper from '../mapper/shelf.mapper';
import { CreateShelfRequestDto, ShelfDto, SmallShelfDto } from '../dto/smallShelfDto';
import { ShelfType } from '../../database/model/shelf.entity';

@Controller('/shelves')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @Get('/all')
  async getAll(): Promise<SmallShelfDto[]> {
    return shelfMapper.toSmallDtos(await this.shelfService.getAllShelves());
  }

  @Get('/:userId')
  async getUserShelves(@Param('userId', ParseIntPipe) userId: number): Promise<SmallShelfDto[]> {
    return shelfMapper.toSmallDtos(await this.shelfService.getUserShelves(userId));
  }

  @Get('/status-shelves/:userId')
  async getUserReadingStatusShelves(@Param('userId', ParseIntPipe) userId: number): Promise<SmallShelfDto[]> {
    return shelfMapper.toSmallDtos(await this.shelfService.getUserReadingStatusShelves(userId));
  }

  @Get('/latest/:userId')
  async getLastUserShelves(@Param('userId', ParseIntPipe) userId: number): Promise<SmallShelfDto[]> {
    return shelfMapper.toSmallDtos(await this.shelfService.getUserShelves(userId, 5));
  }

  @Post('/:userId')
  async createShelf(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createShelfDto: CreateShelfRequestDto,
  ): Promise<SmallShelfDto[]> {
    return shelfMapper.toSmallDtos(await this.shelfService.createShelf(createShelfDto.name, ShelfType.USER, userId));
  }

  @Get('/:userId/:shelfId')
  async getShelfById(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('shelfId', ParseIntPipe) shelfId: number,
  ): Promise<ShelfDto> {
    return shelfMapper.toDto(await this.shelfService.getShelfById(userId, shelfId));
  }

  @Delete('/:userId/:shelfId')
  async removeShelf(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('shelfId', ParseIntPipe) shelfId: number,
  ): Promise<SmallShelfDto> {
    return shelfMapper.toSmallDto(await this.shelfService.removeShelf(userId, shelfId));
  }
}
