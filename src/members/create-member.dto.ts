import { IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name!: string;

  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  email!: string;
}
