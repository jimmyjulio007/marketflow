import { Module } from '@nestjs/common';
import { WorkflowsModule } from '../workflows/workflows.module';
import { CronService } from './cron.service';

@Module({
    imports: [WorkflowsModule],
    providers: [CronService],
})
export class CronModule { }
