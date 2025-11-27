import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) { }

    @Get()
    @ApiOperation({
        summary: 'Health check',
        description: 'Returns overall system health status',
    })
    @ApiResponse({
        status: 200,
        description: 'System is healthy',
        schema: {
            example: {
                status: 'healthy',
                timestamp: '2024-01-01T00:00:00.000Z',
                uptime: 3600,
                services: {
                    database: 'healthy',
                    redis: 'healthy',
                },
            },
        },
    })
    async healthCheck() {
        const services: any = {};

        // Check database
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            services.database = 'healthy';
        } catch (error) {
            services.database = 'unhealthy';
        }

        // Check Redis
        try {
            const redisHealthy = await this.redis.healthCheck();
            services.redis = redisHealthy ? 'healthy' : 'unhealthy';
        } catch (error) {
            services.redis = 'unhealthy';
        }

        const allHealthy = Object.values(services).every((s) => s === 'healthy');

        return {
            status: allHealthy ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            services,
        };
    }

    @Get('ready')
    @ApiOperation({
        summary: 'Readiness check',
        description: 'Returns whether the system is ready to accept requests',
    })
    async readinessCheck() {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return {
                status: 'ready',
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            return {
                status: 'not_ready',
                timestamp: new Date().toISOString(),
            };
        }
    }

    @Get('live')
    @ApiOperation({
        summary: 'Liveness check',
        description: 'Returns whether the application is alive',
    })
    livenessCheck() {
        return {
            status: 'alive',
            timestamp: new Date().toISOString(),
            pid: process.pid,
            memory: process.memoryUsage(),
        };
    }
}
