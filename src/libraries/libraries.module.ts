import { Module } from '@nestjs/common';
import { LibrariesController } from './libraries.controller';
import { LibrariesService } from './libraries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Library } from './libraries.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Library]), UsersModule],
  controllers: [LibrariesController],
  providers: [LibrariesService],
  exports: [LibrariesService, TypeOrmModule],
})
export class LibrariesModule {}
