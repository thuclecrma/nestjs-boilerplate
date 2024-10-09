import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export class AbstractEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
