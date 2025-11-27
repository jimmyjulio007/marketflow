import { IsString, IsOptional } from 'class-validator';

export class CreateTenantDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsString()
    plan?: string; // FREE, PRO, BUSINESS
}

export class UpdateTenantDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    plan?: string;
}

export class InviteUserDto {
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    role?: string; // OWNER, ADMIN, OPERATOR
}
