import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Title must be at least 2 characters long' })
  title!: string;
}
