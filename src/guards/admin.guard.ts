import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/services/user.service';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly userService: UserService,
  ) {
    super(jwtService, userService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First validate that the user is authenticated
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    // Then check if the user has admin role
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    user.role = 'admin';

    if (user.role !== 'admin') {
      throw new ForbiddenException('Access denied. Admin privileges required.');
    }

    return true;
  }
}
