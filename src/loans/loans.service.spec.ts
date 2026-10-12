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

  // Test 1: Check whether the service exists
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test 2: Reject a loan if the member does not exist
  it('throws NotFoundException when member does not exist', async () => {
    const tx = {
      member: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
      copy: {
        findUnique: jest.fn(),
      },
      loan: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    prisma.$transaction.mockImplementation(async (callback) => {
      return callback(tx);
    });

    await expect(
      service.createLoans({
        memberId: 1,
        copyId: 1,
        dueAt: new Date().toISOString(),
      }),
    ).rejects.toThrow(NotFoundException);

    expect(tx.copy.findUnique).not.toHaveBeenCalled();
  });

  // Test 3: Reject a loan if the copy does not exist
  it('throws NotFoundException when copy does not exist', async () => {
    const tx = {
      member: {
        findUnique: jest.fn().mockResolvedValue({ id: 1 }),
      },
      copy: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
      loan: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    prisma.$transaction.mockImplementation(async (callback) => {
      return callback(tx);
    });

    await expect(
      service.createLoans({
        memberId: 1,
        copyId: 1,
        dueAt: new Date().toISOString(),
      }),
    ).rejects.toThrow(NotFoundException);

    expect(tx.loan.findFirst).not.toHaveBeenCalled();
  });

  // Test 4: Prevent borrowing a copy that already has an active loan
  it('throws ConflictException when copy is already borrowed', async () => {
    const tx = {
      member: {
        findUnique: jest.fn().mockResolvedValue({ id: 1 }),
      },
      copy: {
        findUnique: jest.fn().mockResolvedValue({ id: 1 }),
      },
      loan: {
        findFirst: jest.fn().mockResolvedValue({
          id: 10,
          copyId: 1,
          returnedAt: null,
        }),
        create: jest.fn(),
      },
    };

    prisma.$transaction.mockImplementation(async (callback) => {
      return callback(tx);
    });

    await expect(
      service.createLoans({
        memberId: 1,
        copyId: 1,
        dueAt: new Date().toISOString(),
      }),
    ).rejects.toThrow(ConflictException);

    expect(tx.loan.create).not.toHaveBeenCalled();
  });

  // Test 5: Successfully create a loan if the copy is available
  it('creates a loan when copy is available', async () => {
    const dueAt = '2026-10-10T00:00:00.000Z';

    const fakeLoan = {
      id: 1,
      memberId: 1,
      copyId: 1,
      dueAt,
      returnedAt: null,
    };

    const tx = {
      member: {
        findUnique: jest.fn().mockResolvedValue({ id: 1 }),
      },
      copy: {
        findUnique: jest.fn().mockResolvedValue({ id: 1 }),
      },
      loan: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(fakeLoan),
      },
    };

    prisma.$transaction.mockImplementation(async (callback) => {
      return callback(tx);
    });

    const result = await service.createLoans({
      memberId: 1,
      copyId: 1,
      dueAt,
    });

    expect(result).toEqual(fakeLoan);

    expect(tx.loan.create).toHaveBeenCalledWith({
      data: {
        memberId: 1,
        copyId: 1,
        dueAt,
      },
    });
  });
});
