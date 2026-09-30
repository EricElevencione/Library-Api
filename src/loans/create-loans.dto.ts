import { IsNotEmpty, IsDateString, IsInt } from 'class-validator';

export class CreateLoanDto {
  @IsNotEmpty()
  @IsInt()
  memberId!: number;

  @IsNotEmpty()
  @IsInt()
  copyId!: number;

  @IsDateString()
  dueAt!: string;
}
