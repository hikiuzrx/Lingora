// src/lessons/lessons.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonController } from './lessons.controller';
import { LessonService } from './lessons.service';
import { JwtGuard } from '../auth/auth.guard';
import { Lesson, LessonSchema } from './schemas/lesson.schema';
import { Module as ModuleEntity, ModuleSchema } from '../module/schemas/module.schema';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: ModuleEntity.name, schema: ModuleSchema },
    ]),
    AuthModule,    // so JwtGuard can inject JwtAuthService
    UsersModule,   // so JwtGuard can inject UserService
  ],
  controllers: [LessonController],
  providers: [
    LessonService,
    JwtGuard,      // register guard here
  ],
  exports: [LessonService],
})
export class LessonModule {}
