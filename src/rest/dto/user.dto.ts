export type UserDto = {
  id: number;
  name: string;
};

export type CreateUserRequestDto = {
  email: string;
  name: string;
  password: string;
};
