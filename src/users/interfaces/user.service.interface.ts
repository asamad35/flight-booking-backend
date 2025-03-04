export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface IUserService {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(createUserDto: CreateUserDto): Promise<User>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
