import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: any) {
    const { login, password } = body || {};
    const result = await this.authService.signup(login, password);
    return { statusCode: HttpStatus.CREATED, ...result };
  }

  @Post('login')
  @HttpCode(201)
  async login(@Body() body: any) {
    const { login, password } = body || {};
    const tokens = await this.authService.login(login, password);
    return tokens;
  }

  @Post('refresh')
  @HttpCode(201)
  async refresh(@Body() body: any) {
    const { refreshToken } = body || {};
    if (!refreshToken) {
      throw new UnauthorizedException('An refresh token is required');
    }
    return await this.authService.refresh(refreshToken);
  }
}
