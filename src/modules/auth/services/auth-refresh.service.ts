import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';
import { UserGetterService } from 'src/modules/users/services/user-getter.service';

/**
 * Assumes UserGetterService.findById(id)
 */
@Injectable()
export class AuthRefreshService {
  constructor(
    private readonly tokens: TokenService,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    private readonly userGetter: UserGetterService, // inject actual UserGetterService
  ) {}

  async execute(refreshToken: string) {
    try {
      const payload = this.tokens.verifyRefreshToken(refreshToken);
      const user = await this.userGetter.findById(payload.sub);
      if (!user) throw new UnauthorizedException();

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.userRole.name,
      };
      return {
        accessToken: this.tokens.signAccessToken(newPayload),
        refreshToken: this.tokens.signRefreshToken(newPayload),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
