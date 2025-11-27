import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

// Common/Infrastructure
import { ConfigurationModule } from './common/config/config.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { UserModule } from './modules/user/user.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { CronModule } from './modules/cron/cron.module';
import { EventsModule } from './modules/events/events.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigurationModule,

    // Scheduling
    ScheduleModule.forRoot(),

    // Rate Limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),

    // Infrastructure
    PrismaModule,
    RedisModule,

    // Feature Modules
    AuthModule,
    TenantModule,
    UserModule,
    WorkflowsModule,
    EventsModule,
    ChannelsModule,
    CronModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
