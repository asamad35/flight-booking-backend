import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { JwtModule } from '../jwt/jwt.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [JwtModule, UserModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
