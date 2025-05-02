import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Lesson, LessonSchema } from '../../lessons/schemas/lesson.schema';

@Schema()
export class Module extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  description?: string;

  /**
   * Embed lessons as sub-documents:
   */
  @Prop({ type: [LessonSchema], default: [] })
  lessons: Lesson[];
}
export const ModuleSchema = SchemaFactory.createForClass(Module);

