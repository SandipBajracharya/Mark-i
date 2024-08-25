import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  // @UseGuards() guard doesnt work in middleware
  // @UseGuards(JwtAuthGuard)

  constructor(private readonly jwtService: JwtService) {}

  async use(req: any, res: any, next: () => void) {
    const authToken = req.headers?.authorization;
    try {
      if (!authToken || !authToken.startsWith('Bearer '))
        throw new UnauthorizedException();

      const token = authToken.split(' ')[1];
      const publicKey = process.env.JWT_SECRET;
      const decoded = await this.jwtService.verifyAsync(token, {
        publicKey,
      });
      req.user = decoded;
      next();
    } catch (error) {
      let statusCode = 500;
      if (error.message === 'jwt expired') {
        statusCode = 401;
      }
      return res.status(error?.status || statusCode).json({
        message: error?.message || 'Something went wrong',
        statusCode: error?.status || statusCode,
      });
    }
  }
}
