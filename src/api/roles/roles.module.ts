import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
// import { APP_GUARD } from '@nestjs/core';
// import { JwtAuthGuard } from 'src/helper/jwt/jwt.guard';
// import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RolesController],
  providers: [
    RolesService,
    // JwtService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class RolesModule {}
