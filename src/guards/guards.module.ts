import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminGuard } from './admin.guard';
import { UserModule } from '../users/user.module';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'super-secret-key',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [JwtAuthGuard, AdminGuard],
  exports: [JwtAuthGuard, AdminGuard],
})
export class GuardsModule {}
