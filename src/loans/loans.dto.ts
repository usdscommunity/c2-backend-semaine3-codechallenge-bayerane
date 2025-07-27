import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({
    description: `ID de l'emprunteur du livre`,
    example: '123e4567-e89b-12d3-a456-42661417401',
  })
  @IsNotEmpty()
  @IsString()
  borrower_id: string;

  @ApiProperty({
    description: `ID du livre à emprunter`,
    example: '123e4567-e89b-12d3-a456-42661417400',
  })
  @IsNotEmpty()
  @IsString()
  book_id: string;

  @ApiProperty({
    description: `Date de fin de l'emprunt`,
    example: '2023-10-15T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  end_date?: Date;
}

export class UpdateLoanDto {
  @ApiProperty({
    description: `Date de fin de l'emprunt`,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  end_date?: Date;
}

export class ReturnLoanDto {
  @ApiProperty({
    description: 'Marquer le livre comme retourné',
    example: true,
    default: true,
  })
  returned: boolean = true;
}
