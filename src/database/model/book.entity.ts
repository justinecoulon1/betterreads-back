import { Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn({ name: 'book_id' })
  id: number;

  @Column({ length: 200 })
  @Length(1, 200)
  title: string;

  @Column()
  genre: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(title: string, genre: string[], createdAt: Date, updatedAt: Date) {
    this.title = title;
    this.genre = genre;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
