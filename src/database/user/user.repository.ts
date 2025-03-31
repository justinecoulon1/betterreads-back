import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../model/user.entity';

@Injectable()
export class UserRepository {
  private repository: Repository<User>;

  constructor(
    @Inject('DATA_SOURCE')
    dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(User);
  }

  findAll(): Promise<User[]> {
    return this.repository.find();
  }

  save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  findById(id: number): Promise<User> {
    return this.repository.findOneBy({
      id,
    });
  }
}
