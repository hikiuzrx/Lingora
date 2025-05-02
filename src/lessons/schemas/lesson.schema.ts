import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Lesson extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  quizz?: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
