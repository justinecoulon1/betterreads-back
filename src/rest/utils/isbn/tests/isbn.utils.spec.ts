import { generateIsbn10, generateIsbn13, getCleanIsbn, getIsbnType, isValidIsbn } from '../isbn.utils';
import { Isbn, IsbnType } from '../isbn.types';

describe('isbn.utils', () => {
  describe('getCleanIsbn', () => {
    it('removes dashes and spaces from ISBN', () => {
      expect(getCleanIsbn('978-3-16-148410-0')).toBe('9783161484100');
      expect(getCleanIsbn('0 306 40615 2')).toBe('0306406152');
    });
  });

  describe('getIsbnType', () => {
    it('detects ISBN_10 format', () => {
      expect(getIsbnType('0306406152')).toBe(IsbnType.ISBN_10);
      expect(getIsbnType('123456789X')).toBe(IsbnType.ISBN_10);
    });

    it('detects ISBN_13 format', () => {
      expect(getIsbnType('9783161484100')).toBe(IsbnType.ISBN_13);
    });

    it('returns undefined for invalid formats', () => {
      expect(getIsbnType('ABC123')).toBeUndefined();
      expect(getIsbnType('123')).toBeUndefined();
    });
  });

  describe('isValidIsbn', () => {
    it('validates correct ISBN-10', () => {
      const isbn: Isbn = { value: '0306406152', type: IsbnType.ISBN_10 };
      expect(isValidIsbn(isbn)).toBe(true);
    });

    it('invalidates incorrect ISBN-10', () => {
      const isbn: Isbn = { value: '0306406153', type: IsbnType.ISBN_10 };
      expect(isValidIsbn(isbn)).toBe(false);
    });

    it('validates correct ISBN-13', () => {
      const isbn: Isbn = { value: '9783161484100', type: IsbnType.ISBN_13 };
      expect(isValidIsbn(isbn)).toBe(true);
    });

    it('invalidates incorrect ISBN-13', () => {
      const isbn: Isbn = { value: '9783161484101', type: IsbnType.ISBN_13 };
      expect(isValidIsbn(isbn)).toBe(false);
    });

    it('returns false for unknown type', () => {
      const isbn = { value: '123', type: 'UNKNOWN_TYPE' as IsbnType };
      expect(isValidIsbn(isbn)).toBe(false);
    });
  });

  describe('generateIsbn10', () => {
    it('generates ISBN-10 from valid ISBN-13', () => {
      expect(generateIsbn10('9783161484100')).toBe('316148410X');
    });
  });

  describe('generateIsbn13', () => {
    it('generates ISBN-13 from valid ISBN-10', () => {
      expect(generateIsbn13('316148410X')).toBe('9783161484100');
    });
  });
});
