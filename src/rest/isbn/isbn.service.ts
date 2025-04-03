export function checkISBNValidity(isbn: string, isbnType: string): boolean {
  let isValid = false;
  if (isbnType === 'isbn10') {
    isValid = isValidISBN10(isbn);
  } else if (isbnType === 'isbn13') {
    isValid = isValidISBN13(isbn);
  }

  return isValid;
}

export function isValidISBN10(isbn10: string): boolean {
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += (i + 1) * parseInt(isbn10[i], 10);
  }

  const lastChar = isbn10[9];
  const lastDigit = lastChar === 'X' ? 10 : parseInt(lastChar, 10);

  sum += 10 * lastDigit;

  return sum % 11 === 0;
}

export function isValidISBN13(isbn13: string): boolean {
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    const digit = parseInt(isbn13[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }

  const checkDigit = (10 - (sum % 10)) % 10;

  return checkDigit === parseInt(isbn13[12], 10);
}

export function generateISBN10(isbn13: string): string {
  const baseISBN10 = isbn13.substring(3, 12);

  const checkDigit = computeIsbn10CheckDigit(baseISBN10);

  return baseISBN10 + checkDigit;
}

export function generateISBN13(isbn10: string): string {
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
