import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto, UpdateTenantDto, InviteUserDto } from './dto/tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantController {
    constructor(private readonly tenantService: TenantService) { }

    @Get()
    async findAll(): Promise<any> {
        return this.tenantService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<any> {
        return this.tenantService.findOne(id);
    }

    @Post()
    async create(@Body() createTenantDto: CreateTenantDto): Promise<any> {
        return this.tenantService.create(createTenantDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto): Promise<any> {
        return this.tenantService.update(id, updateTenantDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<any> {
        return this.tenantService.remove(id);
    }

    @Post(':id/invite')
    async inviteUser(@Param('id') id: string, @Body() inviteUserDto: InviteUserDto): Promise<any> {
        return this.tenantService.inviteUser(id, inviteUserDto);
    }

    @Get(':id/users')
    async getUsers(@Param('id') id: string): Promise<any> {
        return this.tenantService.getUsers(id);
    }
}
