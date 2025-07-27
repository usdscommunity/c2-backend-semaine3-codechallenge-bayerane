import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from './loans.entity';
import { Repository } from 'typeorm';
import { Book } from 'src/books/books.entity';
import { User } from 'src/users/users.entity';
import { CreateLoanDto, UpdateLoanDto } from './loans.dto';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Loan[]> {
    return this.loanRepository.find({
      relations: ['borrower', 'book', 'book.library'],
      order: { start_date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Loan> {
    const loan = await this.loanRepository.findOne({
      where: { id },
      relations: ['borrower', 'book', 'book.library'],
    });

    if (!loan) {
      throw new NotFoundException(`Prêt avec l'ID ${id} non trouvé`);
    }

    return loan;
  }

  async create(createLoanDto: CreateLoanDto): Promise<Loan> {
    // Vérifier si l'emprunteur existe
    const borrower = await this.userRepository.findOne({
      where: { id: createLoanDto.borrower_id },
    });

    if (!borrower) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${createLoanDto.borrower_id} non trouvé`,
      );
    }

    // Vérifier si le livre existe
    const book = await this.bookRepository.findOne({
      where: { id: createLoanDto.book_id },
      relations: ['library', 'library.user'],
    });

    if (!book) {
      throw new NotFoundException(
        `Livre avec l'ID ${createLoanDto.book_id} non trouvé`,
      );
    }

    // Vérifier si le livre est disponible
    if (!book.available) {
      throw new BadRequestException(
        "Ce livre n'est pas disponible pour l'emprunt",
      );
    }

    // Vérifier qu'un utilisateur ne peut pas emprunter ses propres livres
    if (book.library.user_id === createLoanDto.borrower_id) {
      throw new BadRequestException(
        'Vous ne pouvez pas emprunter vos propres livres',
      );
    }

    // Vérifier s'il n'y a pas déjà un prêt actif pour ce livre
    const existingLoan = await this.loanRepository.findOne({
      where: {
        book_id: createLoanDto.book_id,
        returned: false,
      },
    });

    if (existingLoan) {
      throw new ConflictException('Ce livre est déjà emprunté');
    }

    // Calculer la date de fin (2 semaines par défaut)
    const endDate = createLoanDto.end_date
      ? new Date(createLoanDto.end_date)
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 2 semaines

    // Créer le prêt
    const loan = this.loanRepository.create({
      borrower_id: createLoanDto.borrower_id,
      book_id: createLoanDto.book_id,
      end_date: endDate,
      returned: false,
    });

    const savedLoan = await this.loanRepository.save(loan);

    // Marquer le livre comme non disponible
    await this.bookRepository.update(createLoanDto.book_id, {
      available: false,
    });

    return this.findOne(savedLoan.id);
  }

  async update(id: string, updateLoanDto: UpdateLoanDto): Promise<Loan> {
    const loan = await this.findOne(id);

    if (loan.returned) {
      throw new BadRequestException('Ce prêt est déjà terminé');
    }

    await this.loanRepository.update(id, updateLoanDto);
    return this.findOne(id);
  }

  async returnLoan(id: string): Promise<Loan> {
    const loan = await this.findOne(id);

    if (loan.returned) {
      throw new BadRequestException('Ce livre a déjà été retourné');
    }

    // Marquer le prêt comme retourné
    await this.loanRepository.update(id, { returned: true });

    // Marquer le livre comme disponible
    await this.bookRepository.update(loan.book_id, { available: true });

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const loan = await this.findOne(id);

    // Si le prêt n'est pas encore retourné, rendre le livre disponible
    if (!loan.returned) {
      await this.bookRepository.update(loan.book_id, { available: true });
    }

    await this.loanRepository.remove(loan);
  }

  async findByBorrower(borrowerId: string): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { borrower_id: borrowerId },
      relations: ['book', 'book.library'],
      order: { start_date: 'DESC' },
    });
  }

  async findActiveLoans(): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { returned: false },
      relations: ['borrower', 'book', 'book.library'],
      order: { start_date: 'DESC' },
    });
  }

  async findOverdueLoans(): Promise<Loan[]> {
    const now = new Date();
    return this.loanRepository
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.borrower', 'borrower')
      .leftJoinAndSelect('loan.book', 'book')
      .leftJoinAndSelect('book.library', 'library')
      .where('loan.returned = :returned', { returned: false })
      .andWhere('loan.end_date < :now', { now })
      .orderBy('loan.end_date', 'ASC')
      .getMany();
  }
}
