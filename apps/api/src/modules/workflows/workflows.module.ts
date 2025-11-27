import { Module } from '@nestjs/common';
import { WorkflowOrchestratorService } from './engine/workflow-orchestrator.service';
import { WorkflowLockService } from './engine/workflow-lock.service';
// import { WorkflowsController } from './workflows.controller';

@Module({
    imports: [],
    controllers: [],
    providers: [WorkflowOrchestratorService, WorkflowLockService],
    exports: [WorkflowOrchestratorService],
})
export class WorkflowsModule { }
