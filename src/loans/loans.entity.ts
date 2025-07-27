import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entity';
import { Book } from '../books/books.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'ID unique du prêt' })
  id: string;

  @Column()
  @ApiProperty({ description: "ID de l'emprunteur" })
  borrower_id: string;

  @Column()
  @ApiProperty({ description: 'ID du livre emprunté' })
  book_id: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Date de début du prêt' })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: 'Date de fin prévue du prêt' })
  end_date: Date;

  @Column({ default: false })
  @ApiProperty({ description: 'Statut de retour' })
  returned: boolean;

  // Relations
  @ManyToOne(() => User, (user) => user.loans)
  @JoinColumn({ name: 'borrower_id' })
  borrower: User;

  @ManyToOne(() => Book, (book) => book.loans)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
