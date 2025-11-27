import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateEventDto {
    @IsString()
    source: string; // whatsapp, facebook, api, manual

    @IsString()
    eventType: string; // message.received, workflow.trigger, etc.

    @IsObject()
    payload: any;

    @IsOptional()
    @IsString()
    tenantId?: string;

    @IsOptional()
    @IsString()
    signature?: string; // For webhook verification
}

export class TriggerWorkflowEventDto {
    @IsString()
    workflowId: string;

    @IsOptional()
    @IsObject()
    context?: any;

    @IsOptional()
    @IsString()
    source?: string;
}
