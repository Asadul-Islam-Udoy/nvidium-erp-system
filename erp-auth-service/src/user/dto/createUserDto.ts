import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsEmail({}, { message: 'email must be valid!' })
  @IsNotEmpty({ message: 'Email is required!' })
  email: string;
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
