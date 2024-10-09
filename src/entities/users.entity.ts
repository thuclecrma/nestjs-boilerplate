import { AbstractEntity } from 'src/commons/abstracts/entity.abstract';
import { AuthProvider } from 'src/commons/constants/auth-providers';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ enum: AuthProvider })
  authProvider: AuthProvider;
}
