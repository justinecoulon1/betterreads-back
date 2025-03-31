import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserRequestDto, UserDto } from '../dto/user.dto';
import userMapper from '../mapper/user.mapper';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<UserDto[]> {
    return userMapper.toDtos(await this.userService.getUsers());
  }

  @Post()
  async createUser(@Body() createUserRequestDto: CreateUserRequestDto): Promise<UserDto> {
    return userMapper.toDto(
      await this.userService.createUser(
        createUserRequestDto.name,
        createUserRequestDto.email,
        createUserRequestDto.password,
      ),
    );
  }
}
