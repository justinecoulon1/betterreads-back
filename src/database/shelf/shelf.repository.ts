import { Inject, Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Shelf, ShelfType } from '../model/shelf.entity';

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

  findShelvesByUserId(userId: number): Promise<Shelf[]> {
    return this.repository.find({ where: { user: { id: userId } } });
  }

  findLatestShelvesByUserId(userId: number, amount: number): Promise<Shelf[]> {
    return this.repository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: amount,
    });
  }

  getLastBooksOfShelves(shelves: Shelf[]): Promise<Shelf[]> {
    return this.repository.find({
      relations: { books: true },
    });
  }

  save(shelf: Shelf): Promise<Shelf> {
    return this.repository.save(shelf);
  }

  saveAll(shelf: Shelf[]): Promise<Shelf[]> {
    return this.repository.save(shelf);
  }

  remove(shelf: Shelf): Promise<Shelf> {
    return this.repository.remove(shelf);
  }

  findById(id: number): Promise<Shelf | null> {
    return this.repository.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  findByIdsAndUserId(id: number[], userId: number): Promise<Shelf[] | null> {
    return this.repository.find({
      where: { id: In(id), user: { id: userId } },
      relations: { user: true },
    });
  }

  findByUserIdAndTypeIn(userId: number, shelfTypes: ShelfType[]): Promise<Shelf[] | null> {
    return this.repository.find({
      where: {
        user: { id: userId },
        type: In(shelfTypes),
      },
      relations: { user: true },
    });
  }

  findByBookIdUserIdAndTypeIn(bookId: number, userId: number, shelfTypes: ShelfType[]): Promise<Shelf[] | null> {
    return this.repository.find({
      where: {
        books: { id: bookId },
        user: { id: userId },
        type: In(shelfTypes),
      },
      relations: { user: true },
    });
  }
}
