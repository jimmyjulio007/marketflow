import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class CreateWorkflowDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsObject()
    definition?: any;

    @IsOptional()
    @IsString()
    tenantId?: string;
}

export class UpdateWorkflowDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsObject()
    definition?: any;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
