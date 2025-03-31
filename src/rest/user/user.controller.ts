import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserRequestDto, LoginRequestDto, LoginResponseDto, UserDto } from '../dto/user.dto';
import userMapper from '../mapper/user.mapper';
import { UserService } from './user.service';
import { TokenService } from '../utils/auth/token.service';

@Controller('/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

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

  @Get('/:id')
  async getUserById(@Param('id') id: number): Promise<UserDto> {
    return userMapper.toDto(await this.userService.getUserById(id));
  }

  @Post('/login')
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.getUser(loginRequestDto.email, loginRequestDto.password);
    return {
      accessToken: await this.tokenService.generateAccessToken(user.id),
      user: userMapper.toDto(user),
    };
  }
}
