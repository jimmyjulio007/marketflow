import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(tenantId?: string): Promise<any> {
        const where = tenantId ? { tenantId } : {};

        return this.prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                image: true,
                tenantId: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                image: true,
                tenantId: true,
                createdAt: true,
                updatedAt: true,
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        plan: true
                    }
                }
            }
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<any> {
        // Check if user already exists
        const existing = await this.prisma.user.findUnique({
            where: { email: createUserDto.email }
        });

        if (existing) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: createUserDto.email,
                password: hashedPassword,
                name: createUserDto.name,
                tenantId: createUserDto.tenantId,
                role: createUserDto.role || 'OPERATOR',
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                tenantId: true,
                createdAt: true
            }
        });

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
        await this.findOne(id);

        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                image: true,
                updatedAt: true
            }
        });
    }

    async remove(id: string): Promise<any> {
        await this.findOne(id);

        return this.prisma.user.delete({
            where: { id },
            select: {
                id: true,
                email: true
            }
        });
    }

    async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        if (!user || !user.password) {
            throw new NotFoundException('User not found');
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            throw new ConflictException('Current password is incorrect');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });

        return { message: 'Password updated successfully' };
    }
}
