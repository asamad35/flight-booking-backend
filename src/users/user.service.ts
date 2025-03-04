import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  UserRole,
} from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<UserResponseDto[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<UserResponseDto | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Default role to 'user' if not provided
    const userToCreate = {
      ...createUserDto,
      role: createUserDto.role || UserRole.USER,
    };

    return this.userRepository.create(userToCreate);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto | null> {
    return this.userRepository.update(id, updateUserDto);
  }

  async delete(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  // Get the current logged-in user
  async getCurrentUser(userId: string): Promise<UserResponseDto | null> {
    return this.findById(userId);
  }
}
