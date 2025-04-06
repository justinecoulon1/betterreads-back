export enum IsbnType {
  ISBN_10 = 'ISBN_10',
  ISBN_13 = 'ISBN_13',
}

export type Isbn = {
  type: IsbnType;
  value: string;
};

export type IsbnPair = {
  isbn10: Isbn;
  isbn13: Isbn;
};
