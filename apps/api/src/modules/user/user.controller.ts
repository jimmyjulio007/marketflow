import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async findAll(@Query('tenantId') tenantId?: string): Promise<any> {
        return this.userService.findAll(tenantId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<any> {
        return this.userService.findOne(id);
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<any> {
        return this.userService.create(createUserDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<any> {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<any> {
        return this.userService.remove(id);
    }

    @Put(':id/password')
    async updatePassword(
        @Param('id') id: string,
        @Body() body: { currentPassword: string; newPassword: string }
    ): Promise<any> {
        return this.userService.updatePassword(id, body.currentPassword, body.newPassword);
    }
}
