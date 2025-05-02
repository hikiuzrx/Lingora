import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true ,select:true})
  passwordHash: string;

  @Prop({required: true,select: true,enum: ['user', 'admin'], default: 'user'})
    role: string;
    @Prop({required:true ,select:true,unique:true})
    name:string
}

export const UserSchema = SchemaFactory.createForClass(User);