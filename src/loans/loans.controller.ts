import { Controller, Get, Post, Body } from '@nestjs/common';
import { LoanService } from './loans.service';
import { CreateLoanDto } from './create-loans.dto';

@Controller('loans')
export class LoansController {
  constructor(private loanService: LoanService) {}

  @Get()
  getAllLoans() {
    return this.loanService.getAllLoans();
  }

  @Post()
  create(@Body() createLoanDto: CreateLoanDto) {
    return this.loanService.createLoans(createLoanDto);
  }
}
