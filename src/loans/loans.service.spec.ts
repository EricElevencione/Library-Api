import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { LoanService } from './loans.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LoansService', () => {
  let service: LoanService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LoanService>(LoanService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Happy path', async () => {
    const tx = {
      member: {
        findUnique: jest.fn().mockResolvedValue(null),
      },

      copy: {
        findUnique: jest.fn().mockResolvedValue({
          id: 10,
        }),
      },

      loan: {
        findFirst: jest.fn().mockResolvedValue({
          id: 1,
          memberId: 1,
          copyId: 10,
          returnedAt: null,
        }),
      },
    };

    prisma.$transaction.mockImplementation(async (callback) => {
      return callback(tx);
    });

    await expect(
      service.createLoans({
        memberId: 999,
        copyId: 10,
        dueAt: new Date().toISOString(),
      }),
    ).rejects.toThrow(NotFoundException);

    expect(tx.member.findUnique).toHaveBeenCalled();
  });
});
