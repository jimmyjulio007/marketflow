import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto): Promise<any> {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Create tenant if tenant name provided
        let tenantId = 'default-tenant';
        if (registerDto.tenantName) {
            const tenant = await this.prisma.tenant.create({
                data: {
                    name: registerDto.tenantName,
                    slug: this.generateSlug(registerDto.tenantName),
                    plan: 'FREE',
                },
            });
            tenantId = tenant.id;
        }

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                password: hashedPassword,
                name: registerDto.name,
                tenantId,
                role: 'OWNER', // First user is owner
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                tenantId: true,
            },
        });

        // Generate JWT token
        const token = this.generateToken(user);

        return {
            user,
            token,
        };
    }

    async login(loginDto: LoginDto): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });

        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT token
        const token = this.generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                tenantId: user.tenantId,
            },
            token,
        };
    }

    async validateUser(userId: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                tenantId: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }

    private generateToken(payload: any): string {
        return this.jwtService.sign({
            sub: payload.id,
            email: payload.email,
            role: payload.role,
            tenantId: payload.tenantId,
        });
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
}
