import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const paths = [
  { method: 'POST', path: '/auth/signup' },
  { method: 'POST', path: '/auth/login' },
  { method: 'POST', path: '/auth/refresh' },
  { method: 'GET', path: '/docs' },
  { method: 'GET', path: '/' },
];

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const path = request.path || request.url;

    const isPublic = paths.some(
      (p) =>
        p.method === request.method &&
        (path === p.path || path.startsWith(p.path + '/')),
    );
    if (isPublic) {
      return true;
    }

    const auth = request.headers['authorization'];
    if (!auth) {
      throw new UnauthorizedException('Authorization header not found');
    }

    if (!auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header malformed');
    }

    const token = auth.slice(7).trim();

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY || 'secret123123',
      });

      (request as any).user = {
        userId: payload.userId,
        login: payload.login,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
