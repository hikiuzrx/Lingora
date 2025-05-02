// src/languages/language.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Module, ModuleSchema } from '../../module/schemas/module.schema';

@Schema()
export class Language extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: false, select: true })
  description?: string;

  @Prop({ type: [ModuleSchema], default: [] })
  modules: Module[];
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
