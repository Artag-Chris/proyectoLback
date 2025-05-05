import { 
  IsEmail, 
  IsString, 
  IsStrongPassword, 
  IsNotEmpty, 
  IsBoolean,
  IsOptional,
  IsPhoneNumber,
  Length,
  ValidateIf 
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUsuarioAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @ValidateIf(o => o.password !== undefined) // Solo validar si existe
  // @IsStrongPassword({
  //   minLength: 8,
  //   minLowercase: 1,
  //   minUppercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1
  // })
  password?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  lastName: string;

  @IsString()
  @IsOptional()
  @Length(5, 100)
  address?: string;

  // @IsPhoneNumber('MX') // Especificar región
  @IsOptional()
  phoneNumber?: string;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isAdmin: boolean;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isAvailable: boolean;
}