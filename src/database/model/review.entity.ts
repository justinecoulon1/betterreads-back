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

@Entity()
export class Review {
  @PrimaryGeneratedColumn({ name: 'review_id' })
  id: number;

  @Column()
  commentary: string;

  @Column()
  score: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'app_user_id' })
  user: Promise<User>;

  constructor(commentary: string, score: number, createdAt: Date, updatedAt: Date, user: User) {
    this.commentary = commentary;
    this.score = score;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.user = Promise.resolve(user);
  }
}
