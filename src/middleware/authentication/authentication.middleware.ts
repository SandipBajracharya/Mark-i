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
      return res.status(error?.status || 500).json({
        message: error?.message || 'Something went wrong',
        statusCode: error?.status || 500,
      });
    }
  }
}
