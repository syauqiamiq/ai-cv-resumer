import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAndApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('JwtGuard') private readonly jwtGuard: CanActivate,
    @Inject('ApiKeyGuard') private readonly apiKeyGuard: CanActivate,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const guards = [this.jwtGuard, this.apiKeyGuard];

    for (const guard of guards) {
      try {
        if (await guard.canActivate(context)) {
          return true;
        }
      } catch (error) {
        // Ignore errors to allow OR behavior
      }
    }
    throw new UnauthorizedException('Unauthorized');
  }
}
