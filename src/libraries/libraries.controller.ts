import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LibrariesService } from './libraries.service';
import { Library } from './libraries.entity';
import { CreateLibraryDto, UpdateLibraryDto } from './libraries.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Libraries')
@Controller('libraries')
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Get()
  @ApiOperation({ summary: 'Lister toutes les bibliothèques' })
  @ApiResponse({
    status: 200,
    description: 'Liste des bibliothèques récupérée avec succès',
    type: [Library],
  })
  async findAll(): Promise<Library[]> {
    return this.librariesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une bibliothèque par ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la bibliothèque',
  })
  @ApiResponse({
    status: 200,
    description: 'Bibliothèque retrouvée avec succès',
    type: Library,
  })
  @ApiResponse({
    status: 404,
    description: 'Bibliothèque non trouvée',
  })
  async findOne(@Param('id') id: string): Promise<Library> {
    return this.librariesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle bibliothèque' })
  @ApiResponse({
    status: 201,
    description: 'Bibliothèque crée avec succès',
    type: Library,
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: 'Cet utilisateur possède déjà une bibliothèque',
  })
  async create(@Body() createLibraryDto: CreateLibraryDto): Promise<Library> {
    return this.librariesService.create(createLibraryDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une bibliothèque' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la bibliothèque',
  })
  @ApiResponse({
    status: 200,
    description: 'Bibliothèque mise à jour avec succès',
    type: Library,
  })
  @ApiResponse({
    status: 404,
    description: 'Bibliothèque non trouvée',
  })
  async update(
    @Param('id') id: string,
    @Body() updateLibraryDto: UpdateLibraryDto,
  ): Promise<Library> {
    return this.librariesService.update(id, updateLibraryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une bibliothèque' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID de la bibliothèque',
  })
  @ApiResponse({
    status: 204,
    description: 'Bibliothèque supprimée avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Bibliothèque non trouvée',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.librariesService.remove(id);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Récupérer la bibliothèque d’un utilisateur par ID',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: "ID de l'utilisateur",
  })
  @ApiResponse({
    status: 200,
    description: 'Bibliothèque retrouvée avec succès',
    type: Library,
  })
  @ApiResponse({
    status: 404,
    description: 'Aucune bibliothèque trouvée pour cet utilisateur',
  })
  async findByUserId(@Param('userId') userId: string): Promise<Library> {
    return this.librariesService.findByUserId(userId);
  }
}
