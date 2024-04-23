import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesService } from '../roles/roles.service';
// import { AuthenticationMiddleware } from 'src/middleware/authentication/authentication.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RolesService, JwtService],
})
export class UsersModule {}
