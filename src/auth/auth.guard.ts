import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) {
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers['authorization']?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)

        if (!token) {
            throw new UnauthorizedException('Token missing')
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: "You're just an user"
            })
            request['member'] = payload;
            return true
        } catch {
            throw new UnauthorizedException('Expired or invalid token ')
        }
    }
}