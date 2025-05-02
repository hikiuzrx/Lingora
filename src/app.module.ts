import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ModuleModule } from './lessons/module/module.module';
import { ModuleModule } from './module/module.module';
import { LessonsService } from './lessons/lessons.service';
import { LessonsController } from './lessons/lessons.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ModuleModule,
  ],
  providers: [LessonsService],
  controllers: [LessonsController],
})
export class AppModule {}