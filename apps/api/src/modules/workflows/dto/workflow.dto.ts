import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class CreateWorkflowDto {
    @ApiProperty({
        description: 'Workflow name',
        example: 'Welcome Email Campaign',
        type: String,
    })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: 'Workflow description',
        example: 'Sends welcome emails to new users with personalized content',
        type: String,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Workflow definition (nodes and edges)',
    })
    @IsOptional()
    @IsObject()
    definition?: any;

    @ApiPropertyOptional({
        description: 'Tenant ID (automatically set from JWT if not provided)',
        example: 'clx123...',
        type: String,
    })
    @IsOptional()
    @IsString()
    tenantId?: string;
}

export class UpdateWorkflowDto {
    @ApiPropertyOptional({
        description: 'Workflow name',
        example: 'Updated Welcome Campaign',
        type: String,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'Workflow description',
        example: 'Updated welcome email workflow',
        type: String,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Workflow definition',
    })
    @IsOptional()
    @IsObject()
    definition?: any;

    @ApiPropertyOptional({
        description: 'Whether the workflow is active and can be executed',
        example: true,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
