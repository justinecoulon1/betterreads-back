import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn({ name: 'history_id' })
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'app_user_id' })
  user: Promise<User>;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'book_id' })
  book: Promise<Book>;

  constructor(createdAt: Date, updatedAt: Date, user: User, book: Book) {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.user = Promise.resolve(user);
    this.book = Promise.resolve(book);
  }
}
