import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductRequest {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;
}