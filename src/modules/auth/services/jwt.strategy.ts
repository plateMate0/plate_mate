import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

/**
 * Minimal JWT strategy: validates access tokens only
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'dev_access_secret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string; email: string; role?: string }) {
    // attach to req.user
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
