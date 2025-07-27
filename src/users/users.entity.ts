import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Library } from '../libraries/libraries.entity';
import { Loan } from '../loans/loans.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: `ID unique de l'utilisateur` })
  id: string;

  @Column({ length: 100 })
  @ApiProperty({ description: `Nom de l'utilisateur` })
  name: string;

  @Column({ unique: true, length: 150 })
  @ApiProperty({ description: `Email de l'utilisateur` })
  email: string;

  @Column()
  @ApiProperty({ description: 'Mot de passe hashé' })
  password: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Date de création' })
  created_at: Date;

  // Relations
  @OneToOne(() => Library, (library) => library.user)
  library: Library;

  @OneToMany(() => Loan, (loan) => loan.borrower)
  loans: Loan[];
}
