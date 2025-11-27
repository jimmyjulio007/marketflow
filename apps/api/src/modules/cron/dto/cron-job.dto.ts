import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCronJobDto {
    @ApiProperty({
        description: 'Workflow ID to execute',
        example: 'clx123...',
        type: String,
    })
    @IsString()
    workflowId: string;

    @ApiProperty({
        description: 'Cron expression (Unix cron format)',
        example: '0 9 * * *',
        type: String,
    })
    @IsString()
    schedule: string;

    @ApiPropertyOptional({
        description: 'Tenant ID (automatically set from JWT if not provided)',
        example: 'clx456...',
        type: String,
    })
    @IsOptional()
    @IsString()
    tenantId?: string;

    @ApiPropertyOptional({
        description: 'Whether the cron job is active',
        example: true,
        default: true,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateCronJobDto {
    @ApiPropertyOptional({
        description: 'New cron expression',
        example: '0 10 * * *',
        type: String,
    })
    @IsOptional()
    @IsString()
    schedule?: string;

    @ApiPropertyOptional({
        description: 'Whether the cron job is active',
        example: false,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
