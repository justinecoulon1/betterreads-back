import { ForbiddenException, Injectable } from '@nestjs/common';
import { ShelfRepository } from '../../database/shelf/shelf.repository';
import { Shelf, ShelfType } from '../../database/model/shelf.entity';
import { UserRepository } from '../../database/user/user.repository';
import { ShelfNotFoundException } from './shelf.exceptions';

@Injectable()
export class ShelfService {
  constructor(
    private readonly shelfRepository: ShelfRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getUserShelves(userId: number, amount?: number): Promise<Shelf[]> {
    if (amount) {
      return this.shelfRepository.findLatestShelvesByUserId(userId, amount);
    }
    return this.shelfRepository.findShelvesByUserId(userId);
  }

  async getUserReadingStatusShelves(userId: number): Promise<Shelf[]> {
    const shelves = await this.shelfRepository.findByUserIdAndTypeIn(userId, [
      ShelfType.READING,
      ShelfType.READ,
      ShelfType.TO_READ,
    ]);
    if (shelves.length === 0) {
      throw new ShelfNotFoundException();
    }
    return shelves;
  }

  getAllShelves(): Promise<Shelf[]> {
    return this.shelfRepository.findAll();
  }

  async getShelfById(userId: number, shelfId: number): Promise<Shelf> {
    const shelf = await this.shelfRepository.findById(shelfId);
    if (!shelf) {
      throw new ShelfNotFoundException();
    }
    const shelfUserId = (await shelf.user).id;
    if (userId !== shelfUserId) {
      throw new ForbiddenException();
    }

    return shelf;
  }

  async createShelf(name: string, type: ShelfType, userId: number): Promise<Shelf[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ForbiddenException();
    }

    const newShelf = new Shelf(name, type, new Date(), new Date(), user);
    await this.shelfRepository.save(newShelf);

    return await this.shelfRepository.findShelvesByUserId(userId);
  }

  async removeShelf(userId: number, shelfId: number): Promise<Shelf> {
    const shelf = await this.shelfRepository.findById(shelfId);
    if (!shelf) {
      throw new ShelfNotFoundException();
    }
    if (shelf.type !== ShelfType.USER) {
      throw new ForbiddenException();
    }
    const shelfUserId = (await shelf.user).id;
    if (userId !== shelfUserId) {
      throw new ForbiddenException();
    }

    return await this.shelfRepository.remove(shelf);
  }
}
