import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class RedisService {
    constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) { }

    // Cache operations
    async get(key: string): Promise<string | null> {
        return this.redis.get(key);
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await this.redis.setex(key, ttl, value);
        } else {
            await this.redis.set(key, value);
        }
    }

    async del(key: string): Promise<void> {
        await this.redis.del(key);
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.redis.exists(key);
        return result === 1;
    }

    // Distributed Lock
    async acquireLock(
        resource: string,
        ttl: number = 5000,
        retries: number = 3,
    ): Promise<string | null> {
        const lockKey = `lock:${resource}`;
        const lockValue = `${Date.now()}-${Math.random()}`;

        for (let i = 0; i < retries; i++) {
            const result = await this.redis.set(lockKey, lockValue, 'PX', ttl, 'NX');

            if (result === 'OK') {
                return lockValue;
            }

            // Wait before retry
            await new Promise((resolve) => setTimeout(resolve, 100 * (i + 1)));
        }

        return null;
    }

    async releaseLock(resource: string, lockValue: string): Promise<boolean> {
        const lockKey = `lock:${resource}`;

        const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

        const result = await this.redis.eval(script, 1, lockKey, lockValue);
        return result === 1;
    }

    // Pub/Sub
    async publish(channel: string, message: string): Promise<number> {
        return this.redis.publish(channel, message);
    }

    subscribe(channel: string, callback: (message: string) => void): void {
        const subscriber = this.redis.duplicate();
        subscriber.subscribe(channel);
        subscriber.on('message', (ch, msg) => {
            if (ch === channel) {
                callback(msg);
            }
        });
    }

    // Rate Limiting
    async checkRateLimit(
        key: string,
        limit: number,
        windowMs: number,
    ): Promise<{ allowed: boolean; remaining: number }> {
        const current = await this.redis.incr(key);

        if (current === 1) {
            await this.redis.pexpire(key, windowMs);
        }

        const allowed = current <= limit;
        const remaining = Math.max(0, limit - current);

        return { allowed, remaining };
    }

    // Idempotency
    async isIdempotent(key: string, ttl: number = 86400): Promise<boolean> {
        const idempotencyKey = `idempotency:${key}`;
        const result = await this.redis.set(idempotencyKey, '1', 'EX', ttl, 'NX');
        return result === 'OK';
    }

    async markProcessed(key: string, result: any, ttl: number = 86400): Promise<void> {
        const resultKey = `idempotency:result:${key}`;
        await this.redis.setex(resultKey, ttl, JSON.stringify(result));
    }

    async getProcessedResult(key: string): Promise<any | null> {
        const resultKey = `idempotency:result:${key}`;
        const result = await this.redis.get(resultKey);
        return result ? JSON.parse(result) : null;
    }

    // Query Cache
    async cacheQuery(
        queryKey: string,
        result: any,
        ttl: number = 300,
    ): Promise<void> {
        const cacheKey = `query:${queryKey}`;
        await this.redis.setex(cacheKey, ttl, JSON.stringify(result));
    }

    async getCachedQuery(queryKey: string): Promise<any | null> {
        const cacheKey = `query:${queryKey}`;
        const cached = await this.redis.get(cacheKey);
        return cached ? JSON.parse(cached) : null;
    }

    async invalidateQueryCache(pattern: string): Promise<void> {
        const keys = await this.redis.keys(`query:${pattern}*`);
        if (keys.length > 0) {
            await this.redis.del(...keys);
        }
    }

    // Statistics
    async incrementCounter(key: string, amount: number = 1): Promise<number> {
        return this.redis.incrby(key, amount);
    }

    async getCounter(key: string): Promise<number> {
        const value = await this.redis.get(key);
        return value ? parseInt(value, 10) : 0;
    }

    // Health Check
    async healthCheck(): Promise<boolean> {
        try {
            await this.redis.ping();
            return true;
        } catch (error) {
            return false;
        }
    }
}
