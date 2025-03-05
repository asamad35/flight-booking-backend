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
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { Request } from 'express';
import { UserPayload } from '../guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get current user profile
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: "Returns the current user's profile",
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - user not authenticated',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('JWT-auth')
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
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all users',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - user not authenticated',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - user is not an admin' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  // Get user by ID - Admin or own user only
  @ApiOperation({ summary: 'Get user by ID (Admin or own user only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the specified ID',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - user not authenticated',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not owner or admin' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'ID of the user to retrieve' })
  @ApiBearerAuth('JWT-auth')
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
  // @UseGuards(AdminGuard)
  // @Post()
  // async create(@Body() createUserDto: CreateUserDto) {
  //   // Check if user with email already exists
  //   const existingUser = await this.userService.findByEmail(
  //     createUserDto.email,
  //   );
  //   if (existingUser) {
  //     throw new ConflictException('User with this email already exists');
  //   }

  //   return this.userService.create(createUserDto);
  // }

  // Update user - Admin or own user only
  @ApiOperation({ summary: 'Update user (Admin or own user only)' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully updated',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - user not authenticated',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not owner or admin' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'ID of the user to update' })
  @ApiBody({ type: UpdateUserDto })
  @ApiBearerAuth('JWT-auth')
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
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({
    status: 204,
    description: 'User has been successfully deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - user not authenticated',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - user is not an admin' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'ID of the user to delete' })
  @ApiBearerAuth('JWT-auth')
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
