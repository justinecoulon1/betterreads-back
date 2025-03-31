import { Controller, Get } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import userMapper from '../mapper/user.mapper';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<UserDto[]> {
    return userMapper.toDtos(await this.userService.getUsers());
  }
}
