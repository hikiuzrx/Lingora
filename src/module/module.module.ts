import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { JwtGuard } from 'src/auth/auth.guard';

@Module({
  providers: [ModuleService,JwtGuard],
  controllers: [ModuleController]
})
export class ModuleModule {}
