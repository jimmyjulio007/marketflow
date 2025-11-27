import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsString()
    tenantId: string;

    @IsOptional()
    @IsString()
    role?: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    role?: string;
}

export class UpdateUserPreferencesDto {
    @IsOptional()
    @IsString()
    locale?: string;

    @IsOptional()
    @IsString()
    timezone?: string;

    @IsOptional()
    notificationSettings?: any;
}
