import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma, PrismaClient } from '@marketflow/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    // Expose the prisma instance for dependency injection
    private _prisma = prisma;
    $queryRaw: any;

    // Proxy all Prisma methods through this service
    get $transaction(): PrismaClient['$transaction'] {
        return this._prisma.$transaction.bind(this._prisma);
    }

    get tenant(): PrismaClient['tenant'] {
        return this._prisma.tenant;
    }

    get user(): PrismaClient['user'] {
        return this._prisma.user;
    }

    get apiKey(): PrismaClient['apiKey'] {
        return this._prisma.apiKey;
    }

    get workflow(): PrismaClient['workflow'] {
        return this._prisma.workflow;
    }

    get workflowExecution(): PrismaClient['workflowExecution'] {
        return this._prisma.workflowExecution;
    }

    get workflowExecutionStep(): PrismaClient['workflowExecutionStep'] {
        return this._prisma.workflowExecutionStep;
    }

    get cronJob(): PrismaClient['cronJob'] {
        return this._prisma.cronJob;
    }

    async onModuleInit() {
        await this._prisma.$connect();
    }

    async onModuleDestroy() {
        await this._prisma.$disconnect();
    }
}
