import { Test, TestingModule } from '@nestjs/testing';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';

describe('LoansController', () => {
  let controller: LoansController;

  const mockLoansService = {
    createLoan: jest.fn(),
    getLoan: jest.fn(),
    // Add other service methods your controller uses
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoansController],
      providers: [
        {
          provide: LoansService,
          useValue: mockLoansService,
        },
      ],
    }).compile();

    controller = module.get<LoansController>(LoansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
