import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
// import { IsStrongPasswordLite } from '../validators/is-strong-password.validator';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  // @IsStrongPasswordLite({ message: 'Password is too weak' })
  password!: string;

  // @ApiProperty()
  // @IsOptional()
  // @IsString()
  // role?: string; // e.g., 'user'
}
