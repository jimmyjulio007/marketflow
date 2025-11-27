import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronManagementController } from './cron-management.controller';
import { CronManagementService } from './cron-management.service';
import { WorkflowsModule } from '../workflows/workflows.module';

@Module({
    imports: [WorkflowsModule],
    controllers: [CronManagementController],
    providers: [CronService, CronManagementService],
    exports: [CronManagementService],
})
export class CronModule { }
