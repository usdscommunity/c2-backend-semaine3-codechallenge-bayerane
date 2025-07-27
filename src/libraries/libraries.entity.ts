import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entity';
import { Book } from '../books/books.entity';

@Entity('libraries')
export class Library {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'ID unique de la bibliothèque' })
  id: string;

  @Column({ length: 100 })
  @ApiProperty({ description: 'Nom de la bibliothèque' })
  name: string;

  @Column({ length: 200 })
  @ApiProperty({ description: 'Localisation de la bibliothèque' })
  location: string;

  @Column()
  @ApiProperty({ description: 'ID du propriétaire' })
  user_id: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Date de création' })
  created_at: Date;

  // Relations
  @OneToOne(() => User, (user) => user.library)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Book, (book) => book.library)
  books: Book[];
}
