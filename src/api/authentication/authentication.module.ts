import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { JwtAuthService } from 'src/provider/jwt.service.provider';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRY },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [UsersService, RolesService, JwtAuthService], // do not include JwtService in this providers. It will throw an error related to secret value not found
})
export class AuthenticationModule {}
