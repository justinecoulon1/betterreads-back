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
    return this.repository.find({
      where: {
        user: { id: userId },
        type: ShelfType.USER,
      },
      order: { createdAt: 'DESC' },
    });
  }

  findShelvesContainingBookByUserId(bookId: number, userId: number): Promise<Shelf[]> {
    return this.repository
      .createQueryBuilder('shelf')
      .innerJoin('shelf_book', 'sb', 'sb.shelf_id = shelf.id')
      .innerJoin('book', 'book', 'book.id = sb.book_id')
      .where('book.id = :bookId', { bookId })
      .andWhere('shelf.app_user_id = :userId', { userId })
      .getMany();
  }

  findLatestShelvesByUserId(userId: number, amount: number): Promise<Shelf[]> {
    return this.repository.find({
      where: {
        user: { id: userId },
        type: ShelfType.USER,
      },
      order: { createdAt: 'DESC' },
      take: amount,
    });
  }

  save(shelf: Shelf): Promise<Shelf> {
    return this.repository.save(shelf);
  }

  saveAll(shelves: Shelf[]): Promise<Shelf[]> {
    return this.repository.save(shelves);
  }

  remove(shelf: Shelf): Promise<Shelf> {
    return this.repository.remove(shelf);
  }

  findById(id: number): Promise<Shelf | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        user: true,
        books: {
          authors: true,
        },
      },
    });
  }

  findByIdsAndUserId(id: number[], userId: number): Promise<Shelf[] | null> {
    return this.repository.find({
      where: { id: In(id), user: { id: userId } },
      relations: { user: true },
    });
  }

  findUserShelvesByIds(id: number[], userId: number): Promise<Shelf[] | null> {
    return this.repository.find({
      where: {
        id: In(id),
        user: { id: userId },
        type: ShelfType.USER,
      },
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
