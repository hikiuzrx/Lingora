import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthService {
  constructor(
    private jwt: NestJwtService,
    private config: ConfigService,
  ) {}

  generateAccessToken(payload: { id: string ,role:string}) {
    return this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '7d',
    });
  }

  generateRefreshToken(payload: { id: string,role:string }) {
    return this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }

  verifyToken(token: string, isAccessToken = true) {
    return this.jwt.verify(token, {
      secret: this.config.get<string>(
        isAccessToken ? 'JWT_ACCESS_SECRET' : 'JWT_REFRESH_SECRET',
      ),
    });
  }
}