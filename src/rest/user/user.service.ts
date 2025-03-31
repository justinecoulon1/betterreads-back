import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/user/user.repository';
import { User } from '../../database/model/user.entity';
import { PasswordService } from '../utils/auth/password.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  getUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async createUser(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await this.passwordService.hashPassword(password);
    const newUser = new User(name, email, hashedPassword, new Date(), new Date());
    return this.userRepository.save(newUser);
  }

  getUserById(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }
}
