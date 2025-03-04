import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { Request } from 'express';
import { UserPayload } from '../guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(AdminGuard)
export class DashboardController {
  @Get()
  getDashboard(@Req() request: Request) {
    const user = request['user'] as UserPayload;
    return {
      message: 'Welcome to the admin dashboard',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Get('stats')
  getStats() {
    // Mock stats data - in a real app, this would come from your database
    return {
      totalUsers: 120,
      totalBookings: 450,
      revenueThisMonth: 25000,
      activeFlights: 35,
    };
  }
}
