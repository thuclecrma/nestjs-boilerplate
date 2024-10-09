import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from 'src/commons/constants/auth-providers';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/entities/users.entity';
import { createHash } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(user: CreateUserDto): Promise<User> {
    if (this.configService.get('AUTH_PROVIDER') !== AuthProvider.LOCAL) {
      throw new BadRequestException('This service is not available');
    }
    if (await this.usersService.findOne({ email: user.email })) {
      throw new BadRequestException('User already exists');
    }
    return this.usersService.create(user);
  }

  verifyHashedPassword(password: string, hashedPasswordWithSalt: string) {
    const [hashedPassword, salt] = hashedPasswordWithSalt.split('.');

    const passwordWithSalt = `${password}.${salt}`;
    return (
      hashedPassword ===
      `${createHash('sha256')
        .update(passwordWithSalt)
        .update(this.configService.get('auth.passwordHashSecret'))
        .digest('hex')}`
    );
  }

  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<User> {
    if (this.configService.get('AUTH_PROVIDER') !== AuthProvider.LOCAL) {
      throw new BadRequestException('This service is not available');
    }

    const foundUser = await this.usersService.findOne({
      email,
    });
    if (!foundUser) {
      throw new UnauthorizedException('Email address or password is invalid');
    }
    if (foundUser.authProvider != AuthProvider.LOCAL) {
      throw new BadRequestException(
        'This service is not available for this user',
      );
    }

    if (!this.verifyHashedPassword(password, foundUser.password)) {
      throw new UnauthorizedException('Email address or password is invalid');
    }

    return foundUser;
  }

  login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
