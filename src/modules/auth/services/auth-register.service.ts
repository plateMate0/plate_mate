import { ConflictException, Injectable } from '@nestjs/common';
import { TokenService } from './token.service';
import { RegisterDto } from '../dtos/register.dto';
import { UserGetterService } from 'src/modules/users/services/user-getter.service';
import { UserCreatorService } from 'src/modules/users/services/user-creator.service';
import { HashPasswordService } from 'src/modules/common/services/hash-passowrd.service';

/**
 * Assumes:
 * - UserGetterService.findByEmail(email)
 * - UserCreatorService.create({ email, name, passwordHash, role })
 */
@Injectable()
export class AuthRegisterService {
  constructor(
    private readonly password: HashPasswordService,
    private readonly tokens: TokenService,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    private readonly userGetter: UserGetterService, // inject actual UserGetterService
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    private readonly userCreator: UserCreatorService, // inject actual UserCreatorService
  ) {}

  async execute(dto: RegisterDto) {
    const exists = await this.userGetter.findByEmail(dto.email);
    if (exists) throw new ConflictException('Email already in use');

    // const passwordHash = await this.password.hashPassword(dto.password);
    const user = await this.userCreator.create({
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });

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
