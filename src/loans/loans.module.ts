import { Module } from '@nestjs/common';
import { LoansController } from './loans.controller';
import { LoanService } from './loans.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LoansController],
  providers: [LoanService],
})
export class LoansModule {}
