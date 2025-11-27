import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    from?: string;
    replyTo?: string;
    attachments?: any[];
}

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.initializeTransporter();
    }

    private initializeTransporter() {
        const smtpHost = this.configService.get('SMTP_HOST');
        const sendGridKey = this.configService.get('SENDGRID_API_KEY');

        if (sendGridKey) {
            this.transporter = nodemailer.createTransport({
                host: 'smtp.sendgrid.net',
                port: 587,
                auth: {
                    user: 'apikey',
                    pass: sendGridKey,
                },
            });
            this.logger.log('Email service initialized with SendGrid');
        } else if (smtpHost) {
            this.transporter = nodemailer.createTransport({
                host: smtpHost,
                port: this.configService.get('SMTP_PORT', 587),
                secure: false,
                auth: {
                    user: this.configService.get('SMTP_USER'),
                    pass: this.configService.get('SMTP_PASS'),
                },
            });
            this.logger.log('Email service initialized with SMTP');
        } else {
            this.logger.warn('No email configuration found');
        }
    }

    async sendEmail(options: EmailOptions): Promise<any> {
        if (!this.transporter) {
            throw new Error('Email transporter not configured');
        }

        const mailOptions = {
            from: options.from || this.configService.get('SMTP_FROM', 'noreply@nextflow.io'),
            to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
            replyTo: options.replyTo,
            attachments: options.attachments,
        };

        try {
            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent successfully to ${mailOptions.to}`);
            return {
                success: true,
                messageId: result.messageId,
                to: mailOptions.to,
            };
        } catch (error: any) {
            this.logger.error(`Failed to send email: ${error.message}`);
            throw error;
        }
    }

    async sendTemplateEmail(
        to: string | string[],
        template: string,
        variables: Record<string, any>,
    ): Promise<any> {
        const html = this.renderTemplate(template, variables);

        return this.sendEmail({
            to,
            subject: variables.subject || 'Notification',
            html,
        });
    }

    private renderTemplate(template: string, variables: Record<string, any>): string {
        let html = template;
        Object.keys(variables).forEach((key) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, variables[key]);
        });
        return html;
    }

    async verifyConnection(): Promise<boolean> {
        if (!this.transporter) {
            return false;
        }

        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            this.logger.error('Email connection verification failed');
            return false;
        }
    }
}
