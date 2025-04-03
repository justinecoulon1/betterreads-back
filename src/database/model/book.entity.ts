import { Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shelf } from './shelf.entity';
import { Author } from './author.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn({ name: 'book_id' })
  id: number;

  @Column({ length: 200 })
  @Length(1, 200)
  title: string;

  @Column('varchar', { array: true })
  genres: string[];

  @Column({ name: 'release_date' })
  releaseDate: Date;

  @Column({ name: 'isbn_10' })
  isbn10: string;

  @Column({ name: 'isbn_13' })
  isbn13: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Shelf, (shelf) => shelf.books)
  @JoinTable({
    name: 'shelf_book',
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'shelf_id',
      referencedColumnName: 'id',
    },
  })
  shelves: Promise<Shelf[]>;

  @ManyToMany(() => Author, (author) => author.books)
  @JoinTable({
    name: 'book_author',
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'author_id',
      referencedColumnName: 'id',
    },
  })
  authors: Promise<Author[]>;

  constructor(
    title: string,
    genres: string[],
    releaseDate: Date,
    isbn10: string,
    isbn13: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.title = title;
    this.genres = genres;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.releaseDate = releaseDate;
    this.isbn10 = isbn10;
    this.isbn13 = isbn13;
  }
}
