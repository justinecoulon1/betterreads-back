import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ShelfService } from './shelf.service';
import shelfMapper from '../mapper/shelf.mapper';
import { CreateShelfRequestDto, ShelfDto } from '../dto/shelf.dto';
import { ShelfType } from '../../database/model/shelf.entity';

@Controller('/shelves')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @Get('/all')
  async getAll(): Promise<ShelfDto[]> {
    return shelfMapper.toDtos(await this.shelfService.getAllShelves());
  }

  @Get('/:userId')
  async getUserShelves(@Param('userId') userId: number): Promise<ShelfDto[]> {
    return shelfMapper.toDtos(await this.shelfService.getUserShelves(userId));
  }

  @Get('/latest/:userId')
  async getLastUserShelves(@Param('userId') userId: number): Promise<ShelfDto[]> {
    return shelfMapper.toDtos(await this.shelfService.getUserShelves(userId, 5));
  }

  @Post('/:userId')
  async createShelf(
    @Param('userId') userId: number,
    @Body() createShelfDto: CreateShelfRequestDto,
  ): Promise<ShelfDto[]> {
    return shelfMapper.toDtos(await this.shelfService.createShelf(createShelfDto.name, ShelfType.USER, userId));
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
  ): Promise<ShelfDto> {
    return shelfMapper.toDto(await this.shelfService.removeShelf(userId, shelfId));
  }
}
