import { Controller, Get, Post, Body, Param } from '@nestjs/common';
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

  @Get('due-soon')
  getLoansDueSoon() {
    return this.loanService.getLoansDueSoon();
  }
}
