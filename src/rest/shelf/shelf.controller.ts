import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Post('/:userId')
  async createShelf(@Param('userId') userId: number, @Body() createShelfDto: CreateShelfRequestDto): Promise<ShelfDto> {
    return shelfMapper.toDto(await this.shelfService.createShelf(createShelfDto.name, ShelfType.USER, userId));
  }
}
