import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: `Titre du livre`,
    example: 'Le Petit Prince',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: `Auteur du livre`,
    example: 'Antoine de Saint-Exupéry',
  })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({
    description: `Genre du livre`,
    example: 'Roman',
  })
  @IsNotEmpty()
  @IsString()
  genre: string;

  @ApiProperty({
    description: `ID de la bibliothèque à laquelle le livre appartient`,
    example: '123e4567-e89b-12d3-a456-42661417400',
  })
  @IsNotEmpty()
  @IsString()
  library_id: string;

  @ApiProperty({
    description: `Disponibilité du livre`,
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}

export class UpdateBookDto {
  @ApiProperty({
    description: `Titre du livre`,
    required: false,
  })
  @IsString()
  title?: string;

  @ApiProperty({
    description: `Auteur du livre`,
    required: false,
  })
  @IsString()
  author?: string;

  @ApiProperty({
    description: `Genre du livre`,
    required: false,
  })
  @IsString()
  genre?: string;

  @ApiProperty({
    description: `Disponibilité du livre`,
    required: false,
  })
  @IsBoolean()
  available?: boolean;
}

export class BookQueryDto {
  @ApiProperty({
    description: `Filtrer par disponibilité du livre`,
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  available?: boolean;

  @ApiProperty({
    description: `Filtrer par genre du livre`,
    example: 'Roman',
    required: false,
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({
    description: `Rechercher par titre du livre`,
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: `Rechercher par auteur du livre`,
    required: false,
  })
  @IsOptional()
  @IsString()
  author?: string;
}
