import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/user/user.repository';
import { User } from '../../database/model/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
