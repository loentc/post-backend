import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(email);
        if (user) {
            const comparePass = compareSync(pass, user.password);
            if (!comparePass) {
                throw new UnauthorizedException();
            }
        } else {
            throw new UnauthorizedException();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
    }

    async login(user: CreateUserDto) {
        const payload = {
            email: user.email,
        };
        const access_token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET_KEY,
        });
        const result = {
            user: {
                email: user.email,
            },
            accessToken: access_token,
        };
        return result;
    }

    async validateToken(token: string) {
        const result = await this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET_KEY,
        });
        return result;
    }
}
