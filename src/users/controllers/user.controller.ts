import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  ConflictException,
  HttpStatus,
  HttpCode,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { Request } from 'express';
import { UserPayload } from '../../guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get current user profile
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() request: Request) {
    const currentUser = request['user'] as UserPayload;

    if (!currentUser?.id) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userService.findById(currentUser.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Get all users - Admin only
  @UseGuards(AdminGuard)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  // Get user by ID - Admin or own user only
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string, @Req() request: Request) {
    // Check if the user is retrieving their own profile or is an admin
    const currentUser = request['user'] as UserPayload;
    if (currentUser.id !== id && currentUser.role !== 'admin') {
      throw new ForbiddenException('You can only access your own profile');
    }

    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Create a new user - Admin only
  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // Check if user with email already exists
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return this.userService.create(createUserDto);
  }

  // Update user - Admin or own user only
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    // Check if the user is updating their own profile or is an admin
    const currentUser = request['user'] as UserPayload;
    const isAdmin = currentUser.role === 'admin';

    if (currentUser.id !== id && !isAdmin) {
      throw new ForbiddenException('You can only update your own profile');
    }

    // If user is not an admin and tries to change role, prevent it
    if (!isAdmin && updateUserDto.role) {
      throw new ForbiddenException('You cannot change your role');
    }

    const updatedUser = await this.userService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  // Delete user - Admin only
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const userExists = await this.userService.findById(id);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    await this.userService.delete(id);
  }
}
