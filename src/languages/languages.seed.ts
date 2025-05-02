/**
 * 
 * // src/languages/language.seed.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Language } from './schemas/language.schema';
import { Module as ModuleEntity } from '../module/schemas/module.schema';

@Injectable()
export class LanguageSeedService implements OnModuleInit {
  private readonly logger = new Logger(LanguageSeedService.name);

  constructor(
    @InjectModel(Language.name) private readonly languageModel: Model<Language>,
    @InjectModel(ModuleEntity.name) private readonly moduleModel: Model<ModuleEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.languageModel.countDocuments().exec();
    if (count > 0) {
      this.logger.log('Languages already seeded. Skipping.');
      return;
    }

    this.logger.log('Seeding initial languages...');

    // Example modules
    const basicModule = await this.moduleModel.create({
      title: 'english grammer',
      imageUrl: 'https://example.com/basics.png',
      description: 'Fundamental concepts',
      lessons: [],
    });

    const advancedModule = await this.moduleModel.create({
      title: 'vocabulary',
      imageUrl: 'https://example.com/advanced.png',
      description: 'Deep dive topics',
      lessons: [],
    });

    const languages = [
      {
        title: 'dutch',
        description: 'A versatile scripting language.',
        modules: [basicModule, advancedModule],
      },
      {
        title: 'arabic',
        description: 'Typed superset of JavaScript.',
        modules: [basicModule, advancedModule],
      },
    ];

    await this.languageModel.create(languages);
    this.logger.log('Language seeding complete.');
  }
}

 */