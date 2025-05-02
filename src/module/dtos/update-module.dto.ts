// src/module/dto/update-module.dto.ts
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateModuleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
