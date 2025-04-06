import { Isbn, IsbnType } from './isbn.types';

export function getCleanIsbn(rawIsbn: string): string {
  return rawIsbn.replace(/[-\s]/g, '');
}

export function getIsbnType(isbn: string): IsbnType | undefined {
  if (/^\d{9}[\dX]$/.test(isbn)) {
    return IsbnType.ISBN_10;
  }
  if (/^\d{13}$/.test(isbn)) {
    return IsbnType.ISBN_13;
  }
  return undefined;
}

export function isValidIsbn(isbn: Isbn): boolean {
  if (isbn.type === IsbnType.ISBN_10) {
    return isValidIsbn10(isbn.value);
  } else if (isbn.type === IsbnType.ISBN_13) {
    return isValidIsbn13(isbn.value);
  }
  return false;
}

function isValidIsbn10(isbn10: string): boolean {
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += (i + 1) * parseInt(isbn10[i], 10);
  }

  const lastChar = isbn10[9];
  const lastDigit = lastChar === 'X' ? 10 : parseInt(lastChar, 10);

  sum += 10 * lastDigit;

  return sum % 11 === 0;
}

function isValidIsbn13(isbn13: string): boolean {
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    const digit = parseInt(isbn13[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }

  const checkDigit = (10 - (sum % 10)) % 10;

  return checkDigit === parseInt(isbn13[12], 10);
}

export function generateIsbn10(isbn13: string): string {
  const baseISBN10 = isbn13.substring(3, 12);

  const checkDigit = computeIsbn10CheckDigit(baseISBN10);

  return baseISBN10 + checkDigit;
}

export function generateIsbn13(isbn10: string): string {
  const baseISBN13 = '978' + isbn10.substring(0, 9);

  const checkDigit = computeIsbn13CheckDigit(baseISBN13);

  return baseISBN13 + checkDigit;
}

function computeIsbn10CheckDigit(base: string): string {
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (i + 1) * parseInt(base[i], 10);
  }
  const remainder = sum % 11;
  return remainder === 10 ? 'X' : remainder.toString();
}

function computeIsbn13CheckDigit(base: string): string {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(base[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  return ((10 - (sum % 10)) % 10).toString();
}
