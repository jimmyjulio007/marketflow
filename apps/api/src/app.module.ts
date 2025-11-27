import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { AuthModule } from './modules/auth/auth.module';
import { CronModule } from './modules/cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    WorkflowsModule,
    AuthModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
