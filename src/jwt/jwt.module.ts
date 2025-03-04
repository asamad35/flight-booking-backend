import { Module, forwardRef } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'super-secret-key',
        signOptions: { expiresIn: '1d' },
      }),
    }),
    forwardRef(() => UserModule),
  ],
  providers: [JwtAuthGuard, AdminGuard],
  exports: [NestJwtModule, JwtAuthGuard, AdminGuard],
})
export class JwtModule {}
