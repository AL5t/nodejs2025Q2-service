import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(login: string, password: string) {
    const salt = await bcrypt.genSalt(Number(process.env.CRYPT_SALT) || 10);
    const hashed = await bcrypt.hash(password, salt);

    const created = await this.usersService.createUser({
      login,
      password: hashed,
    });

    return { id: created.id };
  }

  async login(login: string, password: string) {
    const user = await this.usersService.getUserByLogin(login);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ForbiddenException('login or password error');
    }

    const payload = { userId: user.id, login: user.login };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: (process.env.TOKEN_EXPIRE_TIME || '1h') as any,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY || 'secret123123',
      expiresIn: (process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h') as any,
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('An refresh token is required');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY || 'secret123123',
      });

      const newPayload = { userId: payload.userId, login: payload.login };

      const accessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: (process.env.TOKEN_EXPIRE_TIME || '1h') as any,
      });

      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY || 'secret123123',
        expiresIn: (process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h') as any,
      });

      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new ForbiddenException('invalid refresh token');
    }
  }
}
