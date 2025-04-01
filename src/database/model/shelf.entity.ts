import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Length } from 'class-validator';
import { Book } from './book.entity';

enum ShelfType {
  'READ' = 'READ',
  'TO_READ' = 'TO_READ',
  'READING' = 'READING',
}

@Entity()
export class Shelf {
  @PrimaryGeneratedColumn({ name: 'shelf_id' })
  id: number;

  @Column({ length: 100 })
  @Length(1, 100)
  name: string;

  @Column({ name: 'shelf_type' })
  type: ShelfType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.shelves)
  @JoinColumn({ name: 'app_user_id' })
  user: Promise<User>;

  @ManyToMany(() => Book, (book) => book.shelves)
  books: Promise<Book[]>;

  constructor(name: string, type: ShelfType, createdAt: Date, updatedAt: Date, user: User) {
    this.name = name;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.user = Promise.resolve(user);
  }
}
