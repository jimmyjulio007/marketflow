import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto, UpdateWorkflowDto } from './dto/workflow.dto';

@Controller('workflows')
export class WorkflowsController {
    constructor(private readonly workflowsService: WorkflowsService) { }

    @Get()
    async findAll(): Promise<any> {
        return this.workflowsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<any> {
        return this.workflowsService.findOne(id);
    }

    @Post()
    async create(@Body() createWorkflowDto: CreateWorkflowDto): Promise<any> {
        return this.workflowsService.create(createWorkflowDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto): Promise<any> {
        return this.workflowsService.update(id, updateWorkflowDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<any> {
        return this.workflowsService.remove(id);
    }

    @Post(':id/execute')
    async execute(@Param('id') id: string, @Body() context?: any): Promise<any> {
        return this.workflowsService.execute(id, context);
    }

    @Get(':id/executions')
    async getExecutions(@Param('id') id: string): Promise<any> {
        return this.workflowsService.getExecutions(id);
    }
}
