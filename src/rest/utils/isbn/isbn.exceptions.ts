import { BadRequestException } from '@nestjs/common';

export class InvalidIsbnException extends BadRequestException {
  constructor() {
    super('invalid-isbn');
  }
}
