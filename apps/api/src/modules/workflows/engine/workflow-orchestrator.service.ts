import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { WorkflowLockService } from './workflow-lock.service';

@Injectable()
export class WorkflowOrchestratorService {
    constructor(
        private prisma: PrismaService,
        private lockService: WorkflowLockService,
    ) { }

    async processExecution(executionId: string) {
        const locked = await this.lockService.acquireLock(executionId);
        if (!locked) return;

        try {
            const execution = await this.prisma.workflowExecution.findUnique({
                where: { id: executionId },
                include: { workflow: true }
            });

            if (!execution) return;

            // Logic to find next step and execute it
            // ...

            console.log(`Processing execution ${executionId}`);

        } finally {
            await this.lockService.releaseLock(executionId);
        }
    }
}
