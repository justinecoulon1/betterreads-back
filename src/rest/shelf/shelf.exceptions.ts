import { NotFoundException } from '@nestjs/common';

export class ShelfNotFoundException extends NotFoundException {
  constructor() {
    super('shelf-not-found');
  }
}
