import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BookQueryDto, CreateBookDto, UpdateBookDto } from './books.dto';
import { Book } from './books.entity';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les livres',
  })
  @ApiQuery({
    name: 'available',
    required: false,
    description: 'Filtrer par disponibilité du livre',
    example: 'true',
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    description: 'Filtrer par genre du livre',
    example: 'Roman',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Rechercher par titre du livre',
  })
  @ApiQuery({
    name: 'author',
    required: false,
    description: 'Rechercher par auteur du livre',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des livres récupérée avec succès',
    type: [Book],
  })
  async findAll(@Query() query: BookQueryDto): Promise<Book[]> {
    return this.booksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un livre par son ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du livre',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Livre rencontré avec succès',
    type: Book,
  })
  @ApiResponse({
    status: 404,
    description: 'Livre non rencontré',
  })
  async findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Ajouter un nouveau livre à une bibliothèque',
  })
  @ApiResponse({
    status: 201,
    description: 'Livre créé avec succès',
    type: Book,
  })
  @ApiResponse({
    status: 404,
    description: 'Bibliothèque non rencontré',
  })
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Mettre à jour un livre',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du livre',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Livre mis à jour avec succès',
    type: Book,
  })
  @ApiResponse({
    status: 404,
    description: 'Livre non rencontré',
  })
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer un livre',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du livre',
    required: true,
  })
  @ApiResponse({
    status: 204,
    description: 'Livre supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Livre non rencontré',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.booksService.remove(id);
  }

  @Get('library/:libraryId')
  @ApiOperation({
    summary: "Récupérer tous les livres d'une bibliothèque",
  })
  @ApiParam({
    name: 'libraryId',
    description: 'ID de la bibliothèque',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des livres de la bibliothèque récupérée avec succès',
    type: [Book],
  })
  async findByLibrary(@Param('libraryId') libraryId: string): Promise<Book[]> {
    return this.booksService.findByLibrary(libraryId);
  }
}
