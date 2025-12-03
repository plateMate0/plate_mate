import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthApiService } from './auth-api.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtAuthGuard } from '../services/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly api: AuthApiService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.api.login(dto);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.api.register(dto);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.api.refresh(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    // req.user is attached by JwtStrategy.validate
    return { user: req.user };
  }
}
