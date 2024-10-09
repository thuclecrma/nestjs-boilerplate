import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../commons/dtos/pagination.dto';

export class ListUsersDto extends PaginationDto {
  @IsString()
  @IsOptional()
  search: string = null;
}
