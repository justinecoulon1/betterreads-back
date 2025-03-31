import { IsEmail, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('app_user')
export class User {
  @PrimaryGeneratedColumn({ name: 'app_user_id' })
  id: number;

  @Column({ length: 50 })
  @Length(2, 50)
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(name: string, email: string, password: string, createdAt: Date, updatedAt: Date) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
