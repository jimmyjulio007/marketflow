import { Module } from '@nestjs/common';
import { WorkflowOrchestratorService } from './engine/workflow-orchestrator.service';
import { WorkflowLockService } from './engine/workflow-lock.service';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';

@Module({
    imports: [],
    controllers: [WorkflowsController],
    providers: [WorkflowsService, WorkflowOrchestratorService, WorkflowLockService],
    exports: [WorkflowOrchestratorService, WorkflowsService],
})
export class WorkflowsModule { }
