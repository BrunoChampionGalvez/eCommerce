import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { config as dotenvConfig } from 'dotenv'

dotenvConfig({path: '.development.env'})

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest()
    const headers = request.headers

    const token = headers.authorization?.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('Se necesita token.')
    }

    try {
      const secret = process.env.JWT_SECRET
      const payload = this.jwtService.verify(token, { secret })
      payload.iat = new Date(payload.iat * 1000)
      payload.exp = new Date(payload * 1000)
      request.user = payload
      return true
    } catch (error) {
      throw new UnauthorizedException('Token inválido.')
    }
  }
}