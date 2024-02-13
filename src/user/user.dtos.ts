import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  login: string;

  @MinLength(8)
  @IsString()
  password: string;
}
