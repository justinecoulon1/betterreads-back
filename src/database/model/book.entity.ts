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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Shelf, (shelf) => shelf.books)
  @JoinTable({
    name: 'shelfbook',
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
    name: 'bookauthor',
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

  constructor(title: string, genres: string[], createdAt: Date, updatedAt: Date) {
    this.title = title;
    this.genres = genres;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
