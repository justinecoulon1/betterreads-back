import { Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class Author {
  @PrimaryGeneratedColumn({ name: 'author_id' })
  id: number;

  @Column({ length: 100 })
  @Length(2, 100)
  name: string;

  @Column({ length: 100 })
  @Length(2, 100)
  slug: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Book, (book) => book.authors)
  books: Promise<Book[]>;

  constructor(name: string, slug: string, createdAt: Date, updatedAt: Date) {
    this.name = name;
    this.slug = slug;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
