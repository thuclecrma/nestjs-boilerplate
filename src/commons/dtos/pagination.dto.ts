import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(10)
  @Max(100)
  @IsOptional()
  limit: number = 10;
}
