import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
        type: String,
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password (minimum 8 characters)',
        example: 'SecurePass123!',
        minLength: 8,
        type: String,
    })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiPropertyOptional({
        description: 'User full name',
        example: 'John Doe',
        type: String,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'Tenant/workspace name to create',
        example: 'Acme Corporation',
        type: String,
    })
    @IsOptional()
    @IsString()
    tenantName?: string;
}

export class LoginDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
        type: String,
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'SecurePass123!',
        type: String,
    })
    @IsString()
    password: string;
}

export class ResetPasswordDto {
    @ApiProperty({
        description: 'Email address to send reset link',
        example: 'user@example.com',
        type: String,
    })
    @IsEmail()
    email: string;
}

export class UpdatePasswordDto {
    @ApiProperty({
        description: 'Password reset token',
        example: 'eyJhbGc.....',
        type: String,
    })
    @IsString()
    token: string;

    @ApiProperty({
        description: 'New password (minimum 8 characters)',
        example: 'NewSecurePass123!',
        minLength: 8,
        type: String,
    })
    @IsString()
    @MinLength(8)
    newPassword: string;
}
