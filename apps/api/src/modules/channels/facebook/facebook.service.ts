import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface FacebookMessage {
    recipient: { id: string };
    message: {
        text?: string;
        attachment?: {
            type: 'image' | 'video' | 'file' | 'audio';
            payload: { url: string };
        };
    };
}

@Injectable()
export class FacebookService {
    private readonly logger = new Logger(FacebookService.name);
    private readonly baseUrl = 'https://graph.facebook.com/v18.0/me';

    constructor(private readonly configService: ConfigService) { }

    async sendMessage(recipientId: string, text: string): Promise<any> {
        const message: FacebookMessage = {
            recipient: { id: recipientId },
            message: { text },
        };

        return this.sendMessageRequest(message);
    }

    async sendAttachment(
        recipientId: string,
        type: 'image' | 'video' | 'file' | 'audio',
        url: string,
    ): Promise<any> {
        const message: FacebookMessage = {
            recipient: { id: recipientId },
            message: {
                attachment: {
                    type,
                    payload: { url },
                },
            },
        };

        return this.sendMessageRequest(message);
    }

    private async sendMessageRequest(message: FacebookMessage): Promise<any> {
        const accessToken = this.configService.get('FACEBOOK_PAGE_ACCESS_TOKEN');

        if (!accessToken) {
            throw new Error('Facebook Page Access Token not configured');
        }

        const url = `${this.baseUrl}/messages?access_token=${accessToken}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(`Facebook API error: ${JSON.stringify(result)}`);
            }

            this.logger.log(`Facebook message sent to ${message.recipient.id}`);
            return {
                success: true,
                messageId: result.message_id,
                recipientId: message.recipient.id,
            };
        } catch (error: any) {
            this.logger.error(`Failed to send Facebook message: ${error.message}`);
            throw error;
        }
    }

    async getUserProfile(userId: string): Promise<any> {
        const accessToken = this.configService.get('FACEBOOK_PAGE_ACCESS_TOKEN');
        const url = `https://graph.facebook.com/v18.0/${userId}?fields=first_name,last_name,profile_pic&access_token=${accessToken}`;

        const response = await fetch(url);
        return response.json();
    }
}
