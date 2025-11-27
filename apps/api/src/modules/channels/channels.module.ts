import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { WhatsAppService } from './whatsapp/whatsapp.service';
import { FacebookService } from './facebook/facebook.service';
import { RedisModule } from '../../common/redis/redis.module';

@Module({
    imports: [RedisModule],
    providers: [EmailService, WhatsAppService, FacebookService],
    exports: [EmailService, WhatsAppService, FacebookService],
})
export class ChannelsModule { }
