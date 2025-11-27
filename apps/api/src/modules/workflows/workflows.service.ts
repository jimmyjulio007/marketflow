import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateWorkflowDto, UpdateWorkflowDto } from './dto/workflow.dto';
import { WorkflowOrchestratorService } from './engine/workflow-orchestrator.service';

@Injectable()
export class WorkflowsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly orchestrator: WorkflowOrchestratorService,
    ) { }

    async findAll(): Promise<any> {
        return this.prisma.workflow.findMany({
            include: {
                _count: {
                    select: { executions: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string): Promise<any> {
        const workflow = await this.prisma.workflow.findUnique({
            where: { id },
            include: {
                executions: {
                    take: 10,
                    orderBy: { startedAt: 'desc' }
                }
            }
        });

        if (!workflow) {
            throw new NotFoundException(`Workflow with ID ${id} not found`);
        }

        return workflow;
    }

    async create(createWorkflowDto: CreateWorkflowDto): Promise<any> {
        return this.prisma.workflow.create({
            data: {
                name: createWorkflowDto.name,
                description: createWorkflowDto.description,
                definition: createWorkflowDto.definition || {},
                tenantId: createWorkflowDto.tenantId || 'default-tenant',
                isActive: false,
            },
        });
    }

    async update(id: string, updateWorkflowDto: UpdateWorkflowDto): Promise<any> {
        await this.findOne(id);

        return this.prisma.workflow.update({
            where: { id },
            data: {
                name: updateWorkflowDto.name,
                description: updateWorkflowDto.description,
                definition: updateWorkflowDto.definition,
                isActive: updateWorkflowDto.isActive,
            },
        });
    }

    async remove(id: string): Promise<any> {
        await this.findOne(id);

        return this.prisma.workflow.delete({
            where: { id },
        });
    }

    async execute(id: string, context: any = {}): Promise<any> {
        const workflow = await this.findOne(id);

        const execution = await this.prisma.workflowExecution.create({
            data: {
                workflowId: id,
                status: 'PENDING',
                context: context,
            },
        });

        this.orchestrator.processExecution(execution.id).catch((error) => {
            console.error(`Failed to process execution ${execution.id}:`, error);
        });

        return execution;
    }

    async getExecutions(id: string): Promise<any> {
        await this.findOne(id);

        return this.prisma.workflowExecution.findMany({
            where: { workflowId: id },
            include: {
                steps: {
                    orderBy: { startedAt: 'asc' }
                }
            },
            orderBy: { startedAt: 'desc' },
            take: 50,
        });
    }
}
