import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

export enum HistoryStatus {
  'READ' = 'READ',
  'TO_READ' = 'TO_READ',
  'READING' = 'READING',
}

@Entity()
export class History {
  @PrimaryGeneratedColumn({ name: 'history_id' })
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'old_status' })
  oldStatus: HistoryStatus;

  @Column({ name: 'new_status' })
  newStatus: HistoryStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'app_user_id' })
  user: Promise<User>;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'book_id' })
  book: Promise<Book>;

  constructor(createdAt: Date, oldStatus: HistoryStatus, newStatus: HistoryStatus, user: User, book: Book) {
    this.createdAt = createdAt;
    this.oldStatus = oldStatus;
    this.newStatus = newStatus;
    if (user) {
      this.user = Promise.resolve(user);
    }
    if (book) {
      this.book = Promise.resolve(book);
    }
  }
}
