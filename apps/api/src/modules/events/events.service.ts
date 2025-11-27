import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { WorkflowsService } from '../workflows/workflows.service';
import { CreateEventDto, TriggerWorkflowEventDto } from './dto/event.dto';
import * as crypto from 'crypto';

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly workflowsService: WorkflowsService,
    ) { }

    async handleIncomingEvent(createEventDto: CreateEventDto): Promise<any> {
        this.logger.log(`Incoming event: ${createEventDto.eventType} from ${createEventDto.source}`);

        // Validate signature if provided
        if (createEventDto.signature) {
            const isValid = this.validateSignature(
                createEventDto.payload,
                createEventDto.signature,
                createEventDto.source
            );

            if (!isValid) {
                throw new BadRequestException('Invalid signature');
            }
        }

        // Route event based on source and type
        const result = await this.routeEvent(createEventDto);

        // Log event for analytics
        this.logger.debug(`Event processed: ${createEventDto.eventType}`);

        return {
            status: 'received',
            eventType: createEventDto.eventType,
            result
        };
    }

    async triggerWorkflow(triggerDto: TriggerWorkflowEventDto): Promise<any> {
        this.logger.log(`Triggering workflow: ${triggerDto.workflowId}`);

        const execution = await this.workflowsService.execute(
            triggerDto.workflowId,
            {
                ...triggerDto.context,
                triggeredBy: triggerDto.source || 'api',
                triggeredAt: new Date().toISOString()
            }
        );

        return execution;
    }

    async handleWhatsAppWebhook(payload: any): Promise<any> {
        this.logger.log('WhatsApp webhook received');

        const { entry } = payload;
        if (!entry || entry.length === 0) {
            return { status: 'ok' };
        }

        const changes = entry[0].changes;
        if (!changes || changes.length === 0) {
            return { status: 'ok' };
        }

        const value = changes[0].value;
        const messages = value.messages;

        if (messages && messages.length > 0) {
            for (const message of messages) {
                await this.processWhatsAppMessage(message, value);
            }
        }

        return { status: 'processed' };
    }

    async handleFacebookWebhook(payload: any): Promise<any> {
        this.logger.log('Facebook webhook received');

        const { entry } = payload;
        if (!entry) {
            return { status: 'ok' };
        }

        for (const item of entry) {
            const messaging = item.messaging;
            if (messaging) {
                for (const event of messaging) {
                    await this.processFacebookMessage(event);
                }
            }
        }

        return { status: 'processed' };
    }

    private async routeEvent(event: CreateEventDto): Promise<any> {
        switch (event.source) {
            case 'whatsapp':
                return this.handleWhatsAppWebhook(event.payload);

            case 'facebook':
                return this.handleFacebookWebhook(event.payload);

            case 'api':
            case 'manual':
                return { routed: true, type: event.eventType };

            default:
                this.logger.warn(`Unknown event source: ${event.source}`);
                return { routed: false };
        }
    }

    private async processWhatsAppMessage(message: any, context: any): Promise<void> {
        this.logger.debug(`Processing WhatsApp message: ${message.id}`);
        // TODO: Find and trigger relevant workflows
        // TODO: Store message in database
        // TODO: Send to AI for processing if needed
    }

    private async processFacebookMessage(event: any): Promise<void> {
        this.logger.debug(`Processing Facebook message: ${event.message?.mid}`);
        // TODO: Find and trigger relevant workflows
        // TODO: Store message in database
    }

    private validateSignature(payload: any, signature: string, source: string): boolean {
        const secret = process.env[`${source.toUpperCase()}_WEBHOOK_SECRET`];
        if (!secret) {
            this.logger.warn(`No webhook secret configured for ${source}`);
            return true;
        }

        try {
            const expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(JSON.stringify(payload))
                .digest('hex');

            return signature === expectedSignature;
        } catch (error: any) {
            this.logger.error(`Signature validation error: ${error?.message || 'Unknown error'}`);
            return false;
        }
    }
}
