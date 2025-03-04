import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../users/user.service';
import axios from 'axios';

// User payload interface for type safety
export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedException('No authentication token found');
    }
    // check if token is expired
    try {
      const verified = await this.jwtService.verifyAsync(token);
      const email = verified.user_metadata.email;
      const isEmailVerified = verified.user_metadata.email_verified;
      const id = verified.sub;
      const full_name = verified.user_metadata.full_name;

      if (!isEmailVerified) {
        throw new UnauthorizedException('Email not verified');
      }

      // Attach user to request for later use
      request['user'] = {
        id: id,
        email: email,
        full_name: full_name,
      };
      return true;
    } catch (error) {
      console.error(
        'Token verification error:',
        error.response?.data || error.message,
      );
      throw new UnauthorizedException('Invalid authentication token');
    }
  }
}
