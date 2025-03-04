import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';

@Injectable()
export class UserRepository {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') || '',
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '',
    );
  }

  async findAll(): Promise<UserResponseDto[]> {
    const { data, error } = await this.supabase.from('users').select('*');

    if (error) throw new Error(`Error fetching users: ${error.message}`);

    // Filter out any null mappings
    return (
      (data
        ?.map((user) => this.mapUser(user))
        .filter(Boolean) as UserResponseDto[]) || []
    );
  }

  async findById(id: string): Promise<UserResponseDto | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // PGRST116 = no rows returned
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return this.mapUser(data);
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }

    return this.mapUser(data);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Convert DTO to database format (camelCase to snake_case)
    const userData = {
      email: createUserDto.email,
      first_name: createUserDto.firstName,
      last_name: createUserDto.lastName,
      role: createUserDto.role,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const { data, error } = await this.supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw new Error(`Error creating user: ${error.message}`);

    const mappedUser = this.mapUser(data);
    if (!mappedUser) {
      throw new Error('Failed to map created user');
    }

    return mappedUser;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto | null> {
    // Convert DTO to database format (camelCase to snake_case)
    const updateData: any = {};

    if (updateUserDto.firstName !== undefined) {
      updateData.first_name = updateUserDto.firstName;
    }

    if (updateUserDto.lastName !== undefined) {
      updateData.last_name = updateUserDto.lastName;
    }

    if (updateUserDto.role !== undefined) {
      updateData.role = updateUserDto.role;
    }

    updateData.updated_at = new Date();

    const { data, error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Error updating user: ${error.message}`);
    return this.mapUser(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('users').delete().eq('id', id);

    if (error) throw new Error(`Error deleting user: ${error.message}`);
    return true;
  }

  // Map database fields to our DTO (Supabase uses snake_case)
  private mapUser(dbUser: any): UserResponseDto | null {
    if (!dbUser) return null;

    const user = new UserResponseDto();
    user.id = dbUser.id;
    user.email = dbUser.email;
    user.firstName = dbUser.first_name;
    user.lastName = dbUser.last_name;
    user.role = dbUser.role;
    user.createdAt = new Date(dbUser.created_at);
    user.updatedAt = new Date(dbUser.updated_at);

    return user;
  }

  async listUsers() {
    // const { data, error } = await this.supabase.auth.admin.listUsers();

    // if (error) {
    //   console.error('Error listing users:', error.message);
    //   throw new Error(`Error listing users: ${error.message}`);
    // }

    return null;
  }
}
