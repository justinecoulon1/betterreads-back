export type UserDto = {
  id: number;
  name: string;
};

export type CreateUserRequestDto = {
  email: string;
  name: string;
  password: string;
};

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
};

export type RefreshRequestDto = {
  refreshToken: string;
};
