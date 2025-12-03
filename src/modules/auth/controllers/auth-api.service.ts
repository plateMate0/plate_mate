import { Injectable } from '@nestjs/common';
import { AuthLoginService } from '../services/auth-login.service';
import { AuthRegisterService } from '../services/auth-register.service';
import { AuthRefreshService } from '../services/auth-refresh.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { AuthTokensDto } from '../dtos/auth-tokens.dto';

@Injectable()
export class AuthApiService {
  constructor(
    private readonly loginSvc: AuthLoginService,
    private readonly registerSvc: AuthRegisterService,
    private readonly refreshSvc: AuthRefreshService,
  ) {}

  async login(dto: LoginDto): Promise<AuthTokensDto> {
    return this.loginSvc.execute(dto);
  }

  async register(dto: RegisterDto): Promise<AuthTokensDto> {
    return this.registerSvc.execute(dto);
  }

  async refresh(dto: RefreshTokenDto): Promise<AuthTokensDto> {
    return this.refreshSvc.execute(dto.refreshToken);
  }
}
