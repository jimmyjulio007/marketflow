import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../common/prisma/prisma.service';
import { WorkflowOrchestratorService } from '../workflows/engine/workflow-orchestrator.service';

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    constructor(
        private prisma: PrismaService,
        private workflowOrchestrator: WorkflowOrchestratorService,
    ) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        this.logger.debug('Checking for scheduled workflows...');
        const now = new Date();

        const jobs = await this.prisma.cronJob.findMany({
            where: {
                isActive: true,
                nextRunAt: { lte: now }
            }
        });

        for (const job of jobs) {
            this.logger.log(`Triggering cron job ${job.id} for workflow ${job.workflowId}`);
            // Trigger workflow
            // await this.workflowOrchestrator.trigger(job.workflowId, { source: 'cron' });

            // Update next run
            // ...
        }
    }
}
