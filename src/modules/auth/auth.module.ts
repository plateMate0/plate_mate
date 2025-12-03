import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { AuthApiService } from './controllers/auth-api.service';
import { TokenService } from './services/token.service';
import { AuthLoginService } from './services/auth-login.service';
import { AuthRegisterService } from './services/auth-register.service';
import { AuthRefreshService } from './services/auth-refresh.service';
import { JwtStrategy } from './services/jwt.strategy';
// import { UserCreatorService } from '../users/services/user-creator.service';
// import { UserGetterService } from '../users/services/user-getter.service';
import { UserModule } from '../users/user.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    JwtModule.register({
      // for demo simplicity; in real apps read from env
      secret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret',
      signOptions: { expiresIn: '15m' },
    }),
    UserModule,
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthApiService,
    TokenService,
    AuthLoginService,
    AuthRegisterService,
    AuthRefreshService,
    JwtStrategy,
  ],
  exports: [
    TokenService,
    AuthLoginService,
    AuthRegisterService,
    AuthRefreshService,
    JwtStrategy,
  ],
})
export class AuthModule {}
