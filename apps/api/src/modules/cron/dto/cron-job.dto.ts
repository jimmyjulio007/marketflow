import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCronJobDto {
    @IsString()
    workflowId: string;

    @IsString()
    schedule: string; // Cron expression

    @IsOptional()
    @IsString()
    tenantId?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateCronJobDto {
    @IsOptional()
    @IsString()
    schedule?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
