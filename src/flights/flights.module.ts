import { Module } from '@nestjs/common';
import { JwtModule } from 'src/jwt/jwt.module';
import { UserModule } from 'src/users/user.module';
import { FlightsController } from './flights.controller';
import { FlightsRepository } from './flights.repository';
import { FlightsService } from './flights.service';
@Module({
  imports: [JwtModule, UserModule],
  controllers: [FlightsController],
  providers: [FlightsService, FlightsRepository],
  exports: [FlightsService],
})
export class FlightsModule {}
