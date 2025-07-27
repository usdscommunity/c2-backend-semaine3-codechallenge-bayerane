import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Library } from '../libraries/libraries.entity';
import { Loan } from '../loans/loans.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'ID unique du livre' })
  id: string;

  @Column({ length: 200 })
  @ApiProperty({ description: 'Titre du livre' })
  title: string;

  @Column({ length: 150 })
  @ApiProperty({ description: 'Auteur du livre' })
  author: string;

  @Column({ length: 50 })
  @ApiProperty({ description: 'Genre du livre' })
  genre: string;

  @Column()
  @ApiProperty({ description: 'ID de la bibliothèque' })
  library_id: string;

  @Column({ default: true })
  @ApiProperty({ description: 'Disponibilité du livre' })
  available: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'Date de création' })
  created_at: Date;

  // Relations
  @ManyToOne(() => Library, (library) => library.books)
  @JoinColumn({ name: 'library_id' })
  library: Library;

  @OneToMany(() => Loan, (loan) => loan.book)
  loans: Loan[];
}
