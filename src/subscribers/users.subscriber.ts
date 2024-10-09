import { EventSubscriber, InsertEvent } from 'typeorm';
import { User } from '../entities/users.entity';
import { AbstractSubscriber } from '../commons/abstracts/subscriber.abstract';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from 'src/commons/constants/auth-providers';
import authConfig from 'src/configs/auth.config';

@Injectable()
@EventSubscriber()
export class UsersSubscriber extends AbstractSubscriber<User> {
  // TODO: configService should be injected
  private readonly configService = new ConfigService({
    ...authConfig(),
  });

  beforeInsert(event: InsertEvent<User>): void {
    super.beforeInsert(event);

    if (this.configService.get('auth.provider') === AuthProvider.LOCAL) {
      if (!event.entity.password) {
        throw new InternalServerErrorException('Password is required');
      }

      // hashing password with salt
      const salt = randomBytes(8).toString('base64');
      const passwordWithSalt = `${event.entity.password}.${salt}`;
      const hashedPassword = `${createHash('sha256')
        .update(passwordWithSalt)
        .update(this.configService.get('auth.passwordHashSecret'))
        .digest('hex')}.${salt}`;

      event.entity.password = hashedPassword;
      event.entity.authProvider = AuthProvider.LOCAL;
    }
  }
}
