import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Do not allow expired tokens
      secretOrKey: configService.get<string>('JWT_SECRET'), // Secret key from config
    });
  }

  async validate(payload: any) {
    // Validate the user and attach their info to the request
    return { userId: payload.sub, email: payload.email };
  }
}
