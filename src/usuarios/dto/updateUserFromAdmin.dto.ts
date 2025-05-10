import { IsEmail, IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserFromAdminDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    profileImage?: string;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => Boolean(value))
    isAdmin?: boolean;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => Boolean(value))
    isAvailable?: boolean;

    @IsDateString()
    @IsOptional()
    createdAt?: string;
}