import { Injectable } from '@nestjs/common';
import { Isbn, IsbnPair, IsbnType } from './isbn.types';
import { generateIsbn10, generateIsbn13, getCleanIsbn, getIsbnType, isValidIsbn } from './isbn.utils';
import { InvalidIsbnException } from './isbn.exceptions';

@Injectable()
export class IsbnService {
  parseIsbn(rawIsbn: string): Isbn {
    const cleanIsbn = getCleanIsbn(rawIsbn);
    const isbnType = getIsbnType(cleanIsbn);
    if (!isbnType) {
      throw new InvalidIsbnException();
    }
    const isbn: Isbn = { value: cleanIsbn, type: isbnType };
    if (!isValidIsbn(isbn)) {
      throw new InvalidIsbnException();
    }
    return isbn;
  }

  getIsbnPair(isbn: Isbn): IsbnPair {
    if (isbn.type === IsbnType.ISBN_10) {
      return {
        isbn10: isbn,
        isbn13: {
          type: IsbnType.ISBN_13,
          value: generateIsbn13(isbn.value),
        },
      };
    }
    if (isbn.type === IsbnType.ISBN_13) {
      return {
        isbn13: isbn,
        isbn10: {
          type: IsbnType.ISBN_10,
          value: generateIsbn10(isbn.value),
        },
      };
    }
    throw new InvalidIsbnException();
  }
}
