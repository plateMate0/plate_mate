import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';
import { LoginDto } from '../dtos/login.dto';
import { UserGetterService } from 'src/modules/users/services/user-getter.service';
import { HashPasswordService } from 'src/modules/common/services/hash-passowrd.service';

/**
 * Assumes you have a Users module with:
 * - UserGetterService having methods: findByEmail(email) and findById(id)
 * and users have fields: id, email, passwordHash, role, name
 */
@Injectable()
export class AuthLoginService {
  constructor(
    private readonly password: HashPasswordService,
    private readonly tokens: TokenService,
    private readonly userGetter: UserGetterService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.userGetter.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await this.password.comparePasswords(
      dto.password,
      user.password,
    );
    // console.log(ok, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.userRole.name,
    };
    return {
      accessToken: this.tokens.signAccessToken(payload),
      refreshToken: this.tokens.signRefreshToken(payload),
    };
  }
}
