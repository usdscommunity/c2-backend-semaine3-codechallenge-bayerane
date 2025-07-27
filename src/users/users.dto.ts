import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: `Nom de l'utilisateur`,
    example: 'Alassane Diop',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: `Email de l'utilisateur`,
    example: 'diopalassane@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `Mot de passe de l'utilisateur`,
    minLength: 6,
    example: 'password123',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: `Nom de l'utilisateur`,
    required: false,
  })
  @IsString()
  name?: string;

  @ApiProperty({
    description: `Email de l'utilisateur`,
    required: false,
  })
  @IsEmail()
  email?: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  created_at: Date;
}
