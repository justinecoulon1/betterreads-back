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
import { Length } from 'class-validator';

enum ShelveType {
  'READ' = 'READ',
  'TO_READ' = 'TO_READ',
  'READING' = 'READING',
}

@Entity()
export class Shelve {
  @PrimaryGeneratedColumn({ name: 'shelve_id' })
  id: number;

  @Column({ length: 100 })
  @Length(1, 100)
  name: string;

  @Column({ name: 'shelve_type' })
  type: ShelveType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.shelves)
  @JoinColumn({ name: 'app_user_id' })
  user: Promise<User>;

  constructor(name: string, type: ShelveType, createdAt: Date, updatedAt: Date, user: User) {
    this.name = name;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.user = Promise.resolve(user);
  }
}
