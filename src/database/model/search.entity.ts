import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { Author } from './author.entity';

export enum SearchType {
  'BOOK_TITLE' = 'BOOK_TITLE',
  'BOOK_AUTHOR' = 'BOOK_AUTHOR',
  'AUTHOR' = 'AUTHOR',
}

@Entity()
export class Search {
  @PrimaryGeneratedColumn({ name: 'search_id' })
  id: number;

  @Column()
  text: string;

  @Column({ name: 'search_type' })
  searchType: SearchType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Book)
  @JoinColumn({ name: 'book_id' })
  book: Promise<Book>;

  @OneToOne(() => Author)
  @JoinColumn({ name: 'author_id' })
  author: Promise<Author>;

  constructor(text: string, searchType: SearchType, createdAt: Date, updatedAt: Date, book?: Book, author?: Author) {
    this.text = text;
    this.searchType = searchType;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    if (book) {
      this.book = Promise.resolve(book);
    }
    if (author) {
      this.author = Promise.resolve(author);
    }
  }
}
