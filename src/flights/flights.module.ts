import { Module } from '@nestjs/common';
import { FlightsController } from './flights.controller';
import { JwtModule } from '../jwt/jwt.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [JwtModule, UserModule],
  controllers: [FlightsController],
})
export class FlightsModule {}
