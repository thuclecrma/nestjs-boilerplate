import {
  // UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Response } from 'src/commons/others/response';
import PaginationResponse from 'src/commons/others/pagination-response';
import { isArray } from 'class-validator';

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  transformToDto(data: any) {
    return plainToClass(this.dto, data, {
      excludeExtraneousValues: true,
    });
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by the request handler
    // ...
    return next.handle().pipe(
      map((data) => {
        // Run something before the response is sent out
        // ...
        if (
          !(data instanceof Response) &&
          !(data instanceof PaginationResponse)
        ) {
          throw new InternalServerErrorException(
            'Response is not an instance of Response or PaginationResponse',
          );
        }
        if (isArray(data.data)) {
          data.data = data.data.map((item) => this.transformToDto(item));
        } else {
          data.data = this.transformToDto(data.data);
        }
        return data;
      }),
    );
  }
}
