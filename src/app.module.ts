import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';
import { MembersModule } from './members/members.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, BooksModule, MembersModule, LoansModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
