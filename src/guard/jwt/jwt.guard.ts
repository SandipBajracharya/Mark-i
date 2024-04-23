// TODO: create separate folder guards. @UseGuards() misbehave when there is shared dependency injection (for module implementation)

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;
    const authenticationUrl = url.startsWith('/authentication'); // pass guard if authentication

    try {
      if (authenticationUrl) return true;

      const authToken = request.headers.authorization;
      if (!authToken || !authToken.startsWith('Bearer ')) return false;

      const token = authToken.split(' ')[1];
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      return true;
    } catch (error) {
      console.log({ error });
      return false;
    }
  }
}
