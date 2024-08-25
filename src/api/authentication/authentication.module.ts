import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { JwtAuthService } from '@/service/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { EmailModule } from '@/module/email/email.module';
import { QueueModule } from '@/module/rabbit-mq/queue.module';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRY },
    }),
    EmailModule,
    QueueModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    UsersService,
    RolesService,
    JwtAuthService,
    AuthenticationService,
  ], // do not include JwtService in this providers. It will throw an error related to secret value not found
})
export class AuthenticationModule {}
