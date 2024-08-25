import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
