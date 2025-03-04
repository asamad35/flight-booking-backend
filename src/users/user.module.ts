import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [forwardRef(() => JwtModule)],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
