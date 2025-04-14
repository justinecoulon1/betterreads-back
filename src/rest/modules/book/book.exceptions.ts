import { BadRequestException, NotFoundException } from '@nestjs/common';

export class BookNotFoundException extends NotFoundException {
  constructor() {
    super('book-not-found');
  }
}

export class BookAlreadyExistsException extends BadRequestException {
  constructor() {
    super('book-exists');
  }
}
