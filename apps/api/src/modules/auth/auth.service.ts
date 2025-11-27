import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    async validateUser(token: string) {
        // Validate token with Better-Auth or similar
        return { id: 'user-1', tenantId: 'tenant-1' };
    }
}
