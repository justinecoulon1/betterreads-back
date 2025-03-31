import { Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn({ name: 'author_id' })
  id: number;

  @Column({ length: 100 })
  @Length(2, 100)
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(name: string, createdAt: Date, updatedAt: Date) {
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
