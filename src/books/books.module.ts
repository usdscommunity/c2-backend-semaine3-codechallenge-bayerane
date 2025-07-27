import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './books.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrariesModule } from 'src/libraries/libraries.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), LibrariesModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService, TypeOrmModule],
})
export class BooksModule {}
