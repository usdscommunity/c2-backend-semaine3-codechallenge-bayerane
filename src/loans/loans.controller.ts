import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { Loan } from './loans.entity';
import { CreateLoanDto, UpdateLoanDto } from './loans.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Loans')
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les prêts' })
  @ApiResponse({
    status: 200,
    description: 'Liste des prêts récupérée avec succès',
    type: [Loan],
  })
  async findAll(): Promise<Loan[]> {
    return this.loansService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Lister les prêts actifs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des prêts actifs récupérée avec succès',
    type: [Loan],
  })
  async findActiveLoans(): Promise<Loan[]> {
    return this.loansService.findActiveLoans();
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Lister les prêts en retard' })
  @ApiResponse({
    status: 200,
    description: 'Liste des prêts en retard récupérée avec succès',
    type: [Loan],
  })
  async findOverdueLoans(): Promise<Loan[]> {
    return this.loansService.findOverdueLoans();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récuperer un prêts par ID' })
  @ApiParam({ name: 'id', description: 'ID du prêts', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Prêts recuperé avec succès',
    type: Loan,
  })
  @ApiResponse({ status: 404, description: 'Prêts non trouvé' })
  async findOne(@Param('id') id: string): Promise<Loan> {
    return this.loansService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Emprunter un livre' })
  @ApiResponse({
    status: 201,
    description: 'Prêts créé avec succès',
    type: Loan,
  })
  @ApiResponse({
    status: 400,
    description: 'Livre non disponible ou erreur de validation',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur ou livre non trouvé' })
  @ApiResponse({ status: 409, description: 'Livre déja emprunté' })
  async create(@Body() createLoanDto: CreateLoanDto): Promise<Loan> {
    return this.loansService.create(createLoanDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un prêt' })
  @ApiParam({ name: 'id', description: 'ID du prêt', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Prêts mis à jour avec succès',
    type: Loan,
  })
  @ApiResponse({ status: 400, description: 'Prêt déjà terminé' })
  @ApiResponse({ status: 404, description: 'Prêt non trouvé' })
  async update(
    @Param('id') id: string,
    @Body() updateLoanDto: UpdateLoanDto,
  ): Promise<Loan> {
    return this.loansService.update(id, updateLoanDto);
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Terminer un prêt(retourner un livre)' })
  @ApiParam({ name: 'id', description: 'ID du prêts', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Prêts retourné avec succès',
    type: Loan,
  })
  @ApiResponse({ status: 400, description: 'Livre déjà retourné' })
  @ApiResponse({ status: 404, description: 'Prêt non trouvé' })
  async returnLoan(@Param('id') id: string): Promise<Loan> {
    return this.loansService.returnLoan(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un prêt' })
  @ApiParam({ name: 'id', description: 'ID du prêts', type: 'string' })
  @ApiResponse({
    status: 204,
    description: 'Prêt supprimé avec succès',
  })
  @ApiResponse({ status: 404, description: 'Prêt non trouvé' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.loansService.remove(id);
  }

  @Get('borrower/:borrowerId')
  @ApiOperation({ summary: 'Lister tous les prêts d’un utilisateur' })
  @ApiParam({
    name: 'borrowerId',
    description: 'ID de l’utilisateur',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des prêts de l’utilisateur recuperé avec succès',
    type: [Loan],
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non rencontré' })
  async findByBorrower(
    @Param('borrowerId') borrowerId: string,
  ): Promise<Loan[]> {
    return this.loansService.findByBorrower(borrowerId);
  }
}
