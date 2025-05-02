// src/module/dto/create-module.dto.ts
import { IsString, IsOptional, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
