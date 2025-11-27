import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/common/redis';


interface WhatsAppMessage {
    to: string;
    type: 'text' | 'template' | 'image' | 'document';
    text?: { body: string };
    template?: {
        name: string;
        language: { code: string };
        components?: any[];
    };
    image?: { link: string; caption?: string };
    document?: { link: string; filename?: string };
}

@Injectable()
export class WhatsAppService {
    private readonly logger = new Logger(WhatsAppService.name);
    private readonly baseUrl = 'https://graph.facebook.com/v18.0';

    constructor(
        private readonly configService: ConfigService,
        private readonly redis: RedisService,
    ) { }

    async sendMessage(message: WhatsAppMessage): Promise<any> {
        const phoneNumberId = this.configService.get('WHATSAPP_PHONE_NUMBER_ID');
        const accessToken = this.configService.get('WHATSAPP_ACCESS_TOKEN');

        if (!phoneNumberId || !accessToken) {
            throw new Error('WhatsApp credentials not configured');
        }

        const url = `${this.baseUrl}/${phoneNumberId}/messages`;

        const payload = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: message.to,
            type: message.type,
            ...this.buildMessageContent(message),
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(`WhatsApp API error: ${JSON.stringify(result)}`);
            }

            this.logger.log(`WhatsApp message sent to ${message.to}`);
            return {
                success: true,
                messageId: result.messages?.[0]?.id,
                to: message.to,
            };
        } catch (error: any) {
            this.logger.error(`Failed to send WhatsApp message: ${error.message}`);
            throw error;
        }
    }

    async sendTextMessage(to: string, text: string): Promise<any> {
        return this.sendMessage({
            to,
            type: 'text',
            text: { body: text },
        });
    }

    async sendTemplateMessage(
        to: string,
        templateName: string,
        languageCode: string = 'en',
        components?: any[],
    ): Promise<any> {
        return this.sendMessage({
            to,
            type: 'template',
            template: {
                name: templateName,
                language: { code: languageCode },
                components,
            },
        });
    }

    async markAsRead(messageId: string): Promise<void> {
        const phoneNumberId = this.configService.get('WHATSAPP_PHONE_NUMBER_ID');
        const accessToken = this.configService.get('WHATSAPP_ACCESS_TOKEN');

        const url = `${this.baseUrl}/${phoneNumberId}/messages`;

        await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                status: 'read',
                message_id: messageId,
            }),
        });
    }

    private buildMessageContent(message: WhatsAppMessage): any {
        const content: any = {};

        if (message.text) {
            content.text = message.text;
        } else if (message.template) {
            content.template = message.template;
        } else if (message.image) {
            content.image = message.image;
        } else if (message.document) {
            content.document = message.document;
        }

        return content;
    }
}
