import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './books.entity';
import { Library } from 'src/libraries/libraries.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { BookQueryDto, CreateBookDto, UpdateBookDto } from './books.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Library)
    private libraryRepository: Repository<Library>,
  ) {}

  async findAll(query: BookQueryDto): Promise<Book[]> {
    const whereConditions: FindOptionsWhere<Book> = {};

    // Filtrer par disponibilité
    if (query.available !== undefined) {
      whereConditions.available = query.available === true;
    }

    // Filtrer par bibliothèque
    if (query.genre) {
      whereConditions.genre = Like(`%${query.genre}%`);
    }

    // Rechercher par titre
    if (query.title) {
      whereConditions.title = Like(`%${query.title}%`);
    }

    // Rechercher par auteur
    if (query.author) {
      whereConditions.author = Like(`%${query.author}%`);
    }

    return this.bookRepository.find({
      where: whereConditions,
      relations: ['library', 'library.user'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['library', 'library.user', 'loans'],
    });

    if (!book) {
      throw new NotFoundException(`Livre avec l'ID ${id} non trouvé`);
    }

    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    // Vérifier si la bibliothèque existe
    const library = await this.libraryRepository.findOne({
      where: { id: createBookDto.library_id },
    });

    if (!library) {
      throw new NotFoundException(
        `Bibliothèque avec l'ID ${createBookDto.library_id} non trouvée`,
      );
    }

    const book = this.bookRepository.create({
      ...createBookDto,
      available: createBookDto.available ?? true,
    });

    return this.bookRepository.save(book);
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    await this.bookRepository.update(id, updateBookDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
  }

  async updateAvailability(id: string, available: boolean): Promise<Book> {
    await this.bookRepository.update(id, { available });
    return this.findOne(id);
  }

  async findByLibrary(libraryId: string): Promise<Book[]> {
    return this.bookRepository.find({
      where: { library_id: libraryId },
      relations: ['library'],
      order: { created_at: 'DESC' },
    });
  }
}
