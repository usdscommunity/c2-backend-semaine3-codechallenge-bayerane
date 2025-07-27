import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Library } from './libraries.entity';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateLibraryDto, UpdateLibraryDto } from './libraries.dto';

@Injectable()
export class LibrariesService {
  constructor(
    @InjectRepository(Library)
    private libraryRepository: Repository<Library>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Library[]> {
    return this.libraryRepository.find({
      relations: ['user', 'books'],
    });
  }

  async findOne(id: string): Promise<Library> {
    const library = await this.libraryRepository.findOne({
      where: { id },
      relations: ['user', 'books'],
    });

    if (!library) {
      throw new NotFoundException(`Bibliothèque avec l'ID ${id} non trouvée`);
    }

    return library;
  }

  async create(createLibraryDto: CreateLibraryDto): Promise<Library> {
    // Vérifier si l'utilisateur existe
    const user = await this.userRepository.findOne({
      where: { id: createLibraryDto.user_id },
    });

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${createLibraryDto.user_id} non trouvé`,
      );
    }

    // Vérifier si l'utilisateur a déjà une bibliothèque
    const existingLibrary = await this.libraryRepository.findOne({
      where: { user_id: createLibraryDto.user_id },
    });

    if (existingLibrary) {
      throw new ConflictException(
        'Cet utilisateur possède déjà une bibliothèque',
      );
    }

    const library = this.libraryRepository.create(createLibraryDto);
    return this.libraryRepository.save(library);
  }

  async update(
    id: string,
    updateLibraryDto: UpdateLibraryDto,
  ): Promise<Library> {
    await this.libraryRepository.update(id, updateLibraryDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const library = await this.findOne(id);
    await this.libraryRepository.remove(library);
  }

  async findByUserId(userId: string): Promise<Library> {
    const library = await this.libraryRepository.findOne({
      where: { user_id: userId },
      relations: ['user', 'books'],
    });

    if (!library) {
      throw new NotFoundException(
        `Aucune bibliothèque trouvée pour l'utilisateur ${userId}`,
      );
    }

    return library;
  }
}
