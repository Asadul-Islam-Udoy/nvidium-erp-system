import { IsEmail, IsNotEmpty } from 'class-validator';

export class loginUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'email is required!' })
  email: string;

  @IsNotEmpty({ message: 'password is required!' })
  password: string;
}
