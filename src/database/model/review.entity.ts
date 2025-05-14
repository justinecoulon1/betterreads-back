import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn({ name: 'review_id' })
  id: number;

  @Column()
  commentary: string;

  @Column('decimal', { precision: 1, scale: 0 })
  score: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'app_user_id' })
  user: Promise<User>;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'book_id' })
  book: Promise<Book>;

  constructor(commentary: string, score: number, createdAt: Date, updatedAt: Date, user: User, book: Book) {
    this.commentary = commentary;
    this.score = score;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    if (user) {
      this.user = Promise.resolve(user);
    }
    if (book) {
      this.book = Promise.resolve(book);
    }
  }
}
