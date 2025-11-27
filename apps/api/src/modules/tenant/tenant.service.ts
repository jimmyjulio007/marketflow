import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTenantDto, UpdateTenantDto, InviteUserDto } from './dto/tenant.dto';

@Injectable()
export class TenantService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<any> {
        return this.prisma.tenant.findMany({
            include: {
                _count: {
                    select: { users: true, workflows: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string): Promise<any> {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                        createdAt: true
                    }
                },
                _count: {
                    select: { workflows: true, apiKeys: true }
                }
            }
        });

        if (!tenant) {
            throw new NotFoundException(`Tenant with ID ${id} not found`);
        }

        return tenant;
    }

    async create(createTenantDto: CreateTenantDto): Promise<any> {
        // Generate slug if not provided
        const slug = createTenantDto.slug || this.generateSlug(createTenantDto.name);

        // Check if slug already exists
        const existing = await this.prisma.tenant.findUnique({
            where: { slug }
        });

        if (existing) {
            throw new ConflictException(`Tenant with slug ${slug} already exists`);
        }

        return this.prisma.tenant.create({
            data: {
                name: createTenantDto.name,
                slug,
                plan: createTenantDto.plan || 'FREE',
            },
        });
    }

    async update(id: string, updateTenantDto: UpdateTenantDto): Promise<any> {
        await this.findOne(id); // Verify exists

        return this.prisma.tenant.update({
            where: { id },
            data: updateTenantDto,
        });
    }

    async remove(id: string): Promise<any> {
        await this.findOne(id);

        // Check if tenant has users
        const tenant = await this.prisma.tenant.findUnique({
            where: { id },
            include: { _count: { select: { users: true } } }
        });

        if (tenant && tenant._count.users > 0) {
            throw new ConflictException('Cannot delete tenant with existing users');
        }

        return this.prisma.tenant.delete({
            where: { id },
        });
    }

    async inviteUser(tenantId: string, inviteUserDto: InviteUserDto): Promise<any> {
        await this.findOne(tenantId); // Verify tenant exists

        // Check if user already exists in tenant
        const existingUser = await this.prisma.user.findFirst({
            where: {
                email: inviteUserDto.email,
                tenantId
            }
        });

        if (existingUser) {
            throw new ConflictException('User already exists in this tenant');
        }

        // TODO: Send invitation email
        // For now, just return the invite details
        return {
            email: inviteUserDto.email,
            role: inviteUserDto.role || 'OPERATOR',
            tenantId,
            status: 'PENDING',
            message: 'Invitation email would be sent here'
        };
    }

    async getUsers(tenantId: string): Promise<any> {
        await this.findOne(tenantId);

        return this.prisma.user.findMany({
            where: { tenantId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                image: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            + '-' + Math.random().toString(36).substring(2, 6);
    }
}
