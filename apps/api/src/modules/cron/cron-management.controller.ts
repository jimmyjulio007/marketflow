import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateCronJobDto, UpdateCronJobDto } from './dto/cron-job.dto';
import { CronManagementService } from './cron-management.service';

@Controller('cron-jobs')
export class CronManagementController {
    constructor(private readonly cronManagementService: CronManagementService) { }

    @Get()
    async findAll(): Promise<any> {
        return this.cronManagementService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<any> {
        return this.cronManagementService.findOne(id);
    }

    @Post()
    async create(@Body() createCronJobDto: CreateCronJobDto): Promise<any> {
        return this.cronManagementService.create(createCronJobDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCronJobDto: UpdateCronJobDto): Promise<any> {
        return this.cronManagementService.update(id, updateCronJobDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<any> {
        return this.cronManagementService.remove(id);
    }

    @Put(':id/toggle')
    async toggle(@Param('id') id: string): Promise<any> {
        return this.cronManagementService.toggle(id);
    }
}
