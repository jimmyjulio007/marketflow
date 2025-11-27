import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { WorkflowLockService } from './workflow-lock.service';

@Injectable()
export class WorkflowOrchestratorService {
    private readonly logger = new Logger(WorkflowOrchestratorService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly lockService: WorkflowLockService,
    ) { }

    async processExecution(executionId: string): Promise<void> {
        // Use the withLock helper to automatically handle lock acquisition and release
        await this.lockService.withLock(executionId, async () => {
            const execution = await this.prisma.workflowExecution.findUnique({
                where: { id: executionId },
                include: { workflow: true },
            });

            if (!execution) {
                this.logger.warn(`Execution ${executionId} not found`);
                return;
            }

            if (execution.status !== 'PENDING' && execution.status !== 'RUNNING') {
                this.logger.debug(`Execution ${executionId} already processed: ${execution.status}`);
                return;
            }

            this.logger.log(`Processing execution ${executionId} for workflow ${execution.workflow.name}`);

            // Update status to RUNNING
            await this.prisma.workflowExecution.update({
                where: { id: executionId },
                data: { status: 'RUNNING' },
            });

            // TODO: Execute workflow steps based on definition
            // This is where WorkflowDevKit would be integrated
            // For now, just mark as completed

            await this.prisma.workflowExecution.update({
                where: { id: executionId },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date(),
                },
            });

            this.logger.log(`Successfully completed execution ${executionId}`);
        });
    }
}
