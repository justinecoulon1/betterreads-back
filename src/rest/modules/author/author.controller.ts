import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import authorMapper from '../../mapper/author.mapper';
import { AuthorService } from './author.service';
import { AuthorDto, CreateAuthorRequestDto } from '../../dto/author.dto';

@Controller('/authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get('/:id')
  async getAuthorById(@Param('id') id: number): Promise<AuthorDto> {
    return authorMapper.toDto(await this.authorService.getAuthorById(id));
  }

  @Get('/slug/:slug')
  async getAuthorBySlug(@Param('slug') slug: string): Promise<AuthorDto> {
    return authorMapper.toDto(await this.authorService.getAuthorBySlug(slug));
  }

  @Post()
  async createAuthor(@Body() createAuthorRequestDto: CreateAuthorRequestDto): Promise<AuthorDto> {
    return authorMapper.toDto(await this.authorService.createAuthor(createAuthorRequestDto.name));
  }
}
