import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCronJobDto, UpdateCronJobDto } from './dto/cron-job.dto';

const cronParser = require('cron-parser');

@Injectable()
export class CronManagementService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<any> {
        return this.prisma.cronJob.findMany({
            include: {
                workflow: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string): Promise<any> {
        const cronJob = await this.prisma.cronJob.findUnique({
            where: { id },
            include: {
                workflow: true
            }
        });

        if (!cronJob) {
            throw new NotFoundException(`Cron job with ID ${id} not found`);
        }

        return cronJob;
    }

    async create(createCronJobDto: CreateCronJobDto): Promise<any> {
        // Calculate next run time
        const interval = cronParser.parseExpression(createCronJobDto.schedule);
        const nextRunAt = interval.next().toDate();

        return this.prisma.cronJob.create({
            data: {
                workflowId: createCronJobDto.workflowId,
                tenantId: createCronJobDto.tenantId || 'default-tenant',
                schedule: createCronJobDto.schedule,
                nextRunAt,
                isActive: createCronJobDto.isActive !== false,
            },
        });
    }

    async update(id: string, updateCronJobDto: UpdateCronJobDto): Promise<any> {
        await this.findOne(id);

        const data: any = {};

        if (updateCronJobDto.schedule) {
            data.schedule = updateCronJobDto.schedule;
            const interval = cronParser.parseExpression(updateCronJobDto.schedule);
            data.nextRunAt = interval.next().toDate();
        }

        if (updateCronJobDto.isActive !== undefined) {
            data.isActive = updateCronJobDto.isActive;
        }

        return this.prisma.cronJob.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<any> {
        await this.findOne(id);

        return this.prisma.cronJob.delete({
            where: { id },
        });
    }

    async toggle(id: string): Promise<any> {
        const cronJob = await this.findOne(id);

        return this.prisma.cronJob.update({
            where: { id },
            data: {
                isActive: !cronJob.isActive,
            },
        });
    }
}
