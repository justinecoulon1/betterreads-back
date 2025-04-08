import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ShelfRepository } from '../../database/shelf/shelf.repository';
import { Shelf, ShelfType } from '../../database/model/shelf.entity';
import { UserRepository } from '../../database/user/user.repository';

@Injectable()
export class ShelfService {
  constructor(
    private readonly shelfRepository: ShelfRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getUserShelves(id: number): Promise<Shelf[]> {
    const user = await this.userRepository.findById(id);
    return this.shelfRepository.findShelvesByUser(user);
  }

  getAllShelves(): Promise<Shelf[]> {
    return this.shelfRepository.findAll();
  }

  async createShelf(name: string, type: ShelfType, userId: number): Promise<Shelf> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ForbiddenException();
    }

    const newShelf = new Shelf(name, type, new Date(), new Date(), user);
    return this.shelfRepository.save(newShelf);
  }

  async removeShelf(userId: number, shelfId: number): Promise<Shelf> {
    const shelf = await this.shelfRepository.findById(shelfId);
    if (!shelf) {
      throw new NotFoundException('shelf-not-found');
    }
    if (shelf.type !== ShelfType.USER) {
      console.log('wrong type');
      throw new ForbiddenException();
    }
    const shelfUserId = (await shelf.user).id;
    if (userId !== shelfUserId) {
      console.log('wrong user');
      throw new ForbiddenException();
    }

    return await this.shelfRepository.remove(shelf);
  }
}
