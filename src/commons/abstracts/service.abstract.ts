import { PaginationDto } from '../dtos/pagination.dto';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class AbstractService<T extends { id: string }> {
  protected _repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this._repository = repository;
  }

  findOneById(id: string): Promise<T> {
    return this._repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  findOne(where: FindOptionsWhere<T>): Promise<T> {
    return this._repository.findOne({ where });
  }

  findAndCount(
    pagination: PaginationDto,
    where?: FindOptionsWhere<T>,
  ): Promise<[T[], number]> {
    return this._repository.findAndCount({
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      where,
    });
  }

  create(entity: DeepPartial<T>): Promise<T> {
    const createdEntity = this._repository.create(entity);
    return this._repository.save(createdEntity);
  }

  async update(id: string, entity: QueryDeepPartialEntity<T>): Promise<T> {
    await this._repository.update(id, entity);
    const updatedEntity = await this._repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
    return updatedEntity;
  }

  async delete(id: string): Promise<void> {
    await this._repository.softDelete(id);
  }
}
