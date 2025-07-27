import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLibraryDto {
  @ApiProperty({
    description: `Nom de la bibliothèque`,
    example: 'Bibliothèque Municipale',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: `Adresse de la bibliothèque`,
    example: '123 Rue de la République, Dakar',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    description: `ID de l'utilisateur propriétaire de la bibliothèque`,
    example: '123e4567-e89b-12d3-a456-42661417400',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;
}

export class UpdateLibraryDto {
  @ApiProperty({
    description: `Nom de la bibliothèque`,
    required: false,
  })
  @IsString()
  name?: string;

  @ApiProperty({
    description: `Adresse de la bibliothèque`,
    required: false,
  })
  @IsString()
  location?: string;
}
