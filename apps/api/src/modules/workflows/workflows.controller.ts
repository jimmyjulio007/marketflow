import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto, UpdateWorkflowDto } from './dto/workflow.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Workflows')
@Controller('workflows')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WorkflowsController {
    constructor(private readonly workflowsService: WorkflowsService) { }

    @Get()
    @ApiOperation({
        summary: 'List all workflows',
        description: 'Get all workflows for the authenticated user tenant with execution counts',
    })
    @ApiResponse({
        status: 200,
        description: 'Workflows retrieved successfully',
        schema: {
            example: [
                {
                    id: 'clx123...',
                    name: 'Welcome Email Campaign',
                    description: 'Sends welcome emails',
                    isActive: true,
                    tenantId: 'clx456...',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    _count: { executions: 42 },
                },
            ],
        },
    })
    async findAll(): Promise<any> {
        return this.workflowsService.findAll();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get workflow by ID',
        description: 'Retrieve a specific workflow with recent execution history',
    })
    @ApiParam({
        name: 'id',
        description: 'Workflow ID',
        example: 'clx123...',
    })
    @ApiResponse({
        status: 200,
        description: 'Workflow retrieved successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Workflow not found',
    })
    async findOne(@Param('id') id: string): Promise<any> {
        return this.workflowsService.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new workflow',
        description: 'Create a new workflow definition',
    })
    @ApiBody({ type: CreateWorkflowDto })
    @ApiResponse({
        status: 201,
        description: 'Workflow created successfully',
    })
    async create(@Body() createWorkflowDto: CreateWorkflowDto): Promise<any> {
        return this.workflowsService.create(createWorkflowDto);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Update workflow',
        description: 'Update an existing workflow definition',
    })
    @ApiParam({
        name: 'id',
        description: 'Workflow ID',
    })
    @ApiBody({ type: UpdateWorkflowDto })
    @ApiResponse({
        status: 200,
        description: 'Workflow updated successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Workflow not found',
    })
    async update(
        @Param('id') id: string,
        @Body() updateWorkflowDto: UpdateWorkflowDto,
    ): Promise<any> {
        return this.workflowsService.update(id, updateWorkflowDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Delete workflow',
        description: 'Permanently delete a workflow',
    })
    @ApiParam({
        name: 'id',
        description: 'Workflow ID',
    })
    @ApiResponse({
        status: 204,
        description: 'Workflow deleted successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Workflow not found',
    })
    async remove(@Param('id') id: string): Promise<any> {
        return this.workflowsService.remove(id);
    }

    @Post(':id/execute')
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiOperation({
        summary: 'Execute workflow',
        description: 'Trigger a workflow execution with optional context data',
    })
    @ApiParam({
        name: 'id',
        description: 'Workflow ID',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                context: {
                    type: 'object',
                    description: 'Execution context data',
                    example: { userId: 'user123', email: 'user@example.com' },
                },
            },
        },
    })
    @ApiResponse({
        status: 202,
        description: 'Workflow execution started',
        schema: {
            example: {
                id: 'exec123...',
                workflowId: 'clx123...',
                status: 'PENDING',
                context: { userId: 'user123' },
                startedAt: '2024-01-01T00:00:00.000Z',
            },
        },
    })
    async execute(@Param('id') id: string, @Body() body?: any): Promise<any> {
        return this.workflowsService.execute(id, body?.context);
    }

    @Get(':id/executions')
    @ApiOperation({
        summary: 'Get workflow execution history',
        description: 'Retrieve execution history for a specific workflow (last 50)',
    })
    @ApiParam({
        name: 'id',
        description: 'Workflow ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Executions retrieved successfully',
    })
    async getExecutions(@Param('id') id: string): Promise<any> {
        return this.workflowsService.getExecutions(id);
    }
}
