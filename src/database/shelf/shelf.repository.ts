import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Shelf } from '../model/shelf.entity';
import { User } from '../model/user.entity';

@Injectable()
export class ShelfRepository {
  private repository: Repository<Shelf>;

  constructor(
    @Inject('DATA_SOURCE')
    dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(Shelf);
  }

  findAll(): Promise<Shelf[]> {
    return this.repository.find();
  }

  findShelvesByUser(user: User): Promise<Shelf[]> {
    return this.repository.find({ where: { user } });
  }

  save(shelf: Shelf): Promise<Shelf> {
    return this.repository.save(shelf);
  }

  saveAll(shelf: Shelf[]): Promise<Shelf[]> {
    return this.repository.save(shelf);
  }
}
