// src/lessons/lesson.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson } from './schemas/lesson.schema';
import { Model } from 'mongoose';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { Module } from '../module/schemas/module.schema';


@Injectable()
export class LessonService {
    constructor( @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
    @InjectModel(Module.name) private readonly moduleModel: Model<Module>,){}
  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const existingLesson = await this.lessonModel.findOne({ title: createLessonDto.title });
    
    if (existingLesson) {
      throw new ConflictException(`A lesson with title "${createLessonDto.title}" already exists.`);
    }
  
    const lesson =await  this.lessonModel.create(createLessonDto)
    return lesson
  }
  

  async findAll(): Promise<Lesson[]> {
    return this.lessonModel.find().exec();
  }

  async findById(id: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findById(id).exec();
    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${id}" not found`);
    }
    return lesson;
  }
  async findByModuleId(moduleId: string): Promise<Lesson[]> {
    return this.lessonModel.find({ moduleId }).exec();
  }
  
  async findLessonsByModuleTitle(title: string): Promise<Lesson[]> {
    const module = await this.moduleModel.findOne({ title }).exec();
    if (!module) {
      throw new NotFoundException(`Module with title "${title}" not found`);
    }
    return module.lessons;
  }
  async findByTitle(title: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findOne({ title }).exec();
    if (!lesson) {
      throw new NotFoundException(`Lesson with title "${title}" not found`);
    }
    return lesson;
    }
  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    const updatedLesson = await this.lessonModel
      .findByIdAndUpdate(id, updateLessonDto, { new: true })
      .exec();
    if (!updatedLesson) {
      throw new NotFoundException(`Lesson with id "${id}" not found`);
    }
    return updatedLesson;
  }

  async remove(id: string): Promise<void> {
    const result = await this.lessonModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Lesson with id "${id}" not found`);
    }
  }
}
