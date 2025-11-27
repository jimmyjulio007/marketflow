import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/common/redis';

@Injectable()
export class WorkflowLockService {
    constructor(private readonly redis: RedisService) { }

    async acquireLock(executionId: string, ttlMs: number = 5000): Promise<string | null> {
        return this.redis.acquireLock(`workflow:execution:${executionId}`, ttlMs, 5);
    }

    async releaseLock(executionId: string, lockValue: string): Promise<boolean> {
        return this.redis.releaseLock(`workflow:execution:${executionId}`, lockValue);
    }

    async withLock<T>(
        executionId: string,
        fn: () => Promise<T>,
        ttlMs: number = 5000,
    ): Promise<T> {
        const lockValue = await this.acquireLock(executionId, ttlMs);

        if (!lockValue) {
            throw new Error(`Failed to acquire lock for execution ${executionId}`);
        }

        try {
            return await fn();
        } finally {
            await this.releaseLock(executionId, lockValue);
        }
    }
}
