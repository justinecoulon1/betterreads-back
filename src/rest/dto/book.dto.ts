export type BookListDto = {
  id: number;
  title: string;
  createdAt: Date;
};

export type BookDto = {
  id: number;
  title: string;
  createdAt: Date;
  genres: string[];
  //author
};
