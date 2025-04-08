import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../database/user/user.repository';
import { User } from '../../database/model/user.entity';
import { PasswordService } from '../utils/auth/password.service';
import { TransactionService } from '../../database/utils/transaction/transaction.service';
import { Shelf, ShelfType } from '../../database/model/shelf.entity';
import { ShelfRepository } from '../../database/shelf/shelf.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly transactionService: TransactionService,
    private readonly shelfRepository: ShelfRepository,
  ) {}

  getUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async createUser(name: string, email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (user) {
      throw new ConflictException('Email address already in use');
    }
    const hashedPassword = await this.passwordService.hashPassword(password);
    const newUser = new User(name, email, hashedPassword, new Date(), new Date());

    return this.transactionService.wrapInTransaction(async () => {
      const user = await this.userRepository.save(newUser);

      await this.shelfRepository.saveAll([
        new Shelf('To read', ShelfType.TO_READ, new Date(), new Date(), user),
        new Shelf('Read', ShelfType.READ, new Date(), new Date(), user),
        new Shelf('Reading', ShelfType.READING, new Date(), new Date(), user),
      ]);

      return user;
    });
  }

  getUserById(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  async getUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!(await this.passwordService.verifyPassword(password, user.password))) {
      throw new ForbiddenException('Wrong credentials');
    }
    return user;
  }
}
