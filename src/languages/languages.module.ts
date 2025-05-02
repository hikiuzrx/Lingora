// src/languages/languages.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Language, LanguageSchema } from './schemas/language.schema';
import { Module as ModuleEntity, ModuleSchema } from '../module/schemas/module.schema';
//import { LanguageSeedService } from './languages.seed';
import { LanguagesService } from './languages.service';
import { JwtGuard } from '../auth/auth.guard';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Language.name, schema: LanguageSchema },
      { name: ModuleEntity.name, schema: ModuleSchema },
    ]),
    AuthModule,
    UsersModule,
  ],
  providers: [
    LanguagesService,
    //LanguageSeedService,
    JwtGuard, // if guarding any language routes
  ],
  exports: [LanguagesService],
})
export class LanguagesModule {}