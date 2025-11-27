import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, TriggerWorkflowEventDto } from './dto/event.dto';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    async handleEvent(@Body() createEventDto: CreateEventDto): Promise<any> {
        return this.eventsService.handleIncomingEvent(createEventDto);
    }

    @Post('trigger-workflow')
    async triggerWorkflow(@Body() triggerDto: TriggerWorkflowEventDto): Promise<any> {
        return this.eventsService.triggerWorkflow(triggerDto);
    }

    @Post('webhooks/whatsapp')
    async whatsappWebhook(@Body() payload: any): Promise<any> {
        return this.eventsService.handleWhatsAppWebhook(payload);
    }

    @Get('webhooks/whatsapp')
    async verifyWhatsApp(@Query() query: any): Promise<any> {
        // WhatsApp webhook verification
        const mode = query['hub.mode'];
        const token = query['hub.verify_token'];
        const challenge = query['hub.challenge'];

        if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
            return challenge;
        }

        return { error: 'Verification failed' };
    }

    @Post('webhooks/facebook')
    async facebookWebhook(@Body() payload: any): Promise<any> {
        return this.eventsService.handleFacebookWebhook(payload);
    }

    @Get('webhooks/facebook')
    async verifyFacebook(@Query() query: any): Promise<any> {
        // Facebook webhook verification
        const mode = query['hub.mode'];
        const token = query['hub.verify_token'];
        const challenge = query['hub.challenge'];

        if (mode === 'subscribe' && token === process.env.FACEBOOK_VERIFY_TOKEN) {
            return challenge;
        }

        return { error: 'Verification failed' };
    }
}
