import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtAuthService } from './jwt.service';
import { Request, Response as ExpressResponse } from 'express';
import { User } from 'src/users/schemas/user.schema';
import { UserService } from 'src/users/users.service';

declare module 'express' {
  export interface Request {
    user?: User;
  }
}

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response: ExpressResponse = context.switchToHttp().getResponse();

    const accessToken = this.extractAccessToken(request);
    const refreshToken = this.extractRefreshToken(request);
    let payload: any;

    try {
      if (accessToken) {
        payload = this.jwtAuthService.verifyToken(accessToken, true);
      } else if (refreshToken) {
        payload = this.jwtAuthService.verifyToken(refreshToken, false);

        // Refresh tokens if refresh token is valid
        const newAccessToken = this.jwtAuthService.generateAccessToken(payload);
        const newRefreshToken = this.jwtAuthService.generateRefreshToken(payload);

        // Set cookies or Authorization headers as per your approach
        response.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        });

        response.setHeader('Authorization', `Bearer ${newAccessToken}`);
      } else {
        throw new UnauthorizedException('No authentication token provided');
      }

      const { id, role } = payload;
      if (!id || !role) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.usersService.findById(id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;
      return true;
    } catch (err) {
      this.logger.error(`Authentication failed: ${err.message}`);
      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }

  private extractAccessToken(request: Request): string | undefined {
    const authHeader = request.headers?.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  private extractRefreshToken(request: Request): string | undefined {
    return request.cookies?.refreshToken;
  }
}
