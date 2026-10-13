import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto } from './create-loans.dto';

@Injectable()
export class LoanService {
  constructor(private prisma: PrismaService) {}

  async getAllLoans() {
    return this.prisma.loan.findMany();
  }

  async createLoans(createLoan: CreateLoanDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const member = await tx.member.findUnique({
        where: {
          id: createLoan.memberId,
        },
      });

      if (member === null) {
        throw new NotFoundException('Member Id not found');
      }

      const copy = await tx.copy.findUnique({
        where: {
          id: createLoan.copyId,
        },
      });

      if (copy === null) {
        throw new NotFoundException('Copy Id not found');
      }

      const activeLoan = await tx.loan.findFirst({
        where: {
          copyId: createLoan.copyId,
          returnedAt: null,
        },
      });

      if (activeLoan !== null) {
        throw new ConflictException('This copy is currently unavailable');
      }

      const loan = await tx.loan.create({
        data: {
          memberId: createLoan.memberId,
          copyId: createLoan.copyId,
          dueAt: createLoan.dueAt,
        },
      });
      return loan;
    });
    return result;
  }

  // to check whether the loans is due soon or not so that it flags
  async getLoansDueSoon() {
    const now = new Date();

    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    return this.prisma.loan.findMany({
      where: {
        dueAt: {
          gte: now,
          lte: next24Hours,
        },
        returnedAt: null,
      },
      select: {
        id: true,
        dueAt: true,
        member: {
          select: {
            name: true,
            email: true,
          },
        },
        copy: {
          select: {
            book: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });
  }
}
