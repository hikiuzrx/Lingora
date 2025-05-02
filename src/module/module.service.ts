// src/module/module.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module } from './schemas/module.schema';
import { CreateModuleDto } from './dtos/create-module.dto';
import { UpdateModuleDto } from './dtos/update-module.dto';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { Express } from 'express';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name) private readonly moduleModel: Model<Module>,
  ) {}

  async create(data: CreateModuleDto, file?: Express.Multer.File) {
    let imageUrl = data.imageUrl;

    if (file) {
      const uploadResult = await this.uploadToCloudinary(file);
      imageUrl = uploadResult.secure_url;
    }

    return this.moduleModel.create({ ...data, imageUrl });
  }

  async findAll(page: number = 1, limit: number = 10, title?: string) {
    const query: any = {};
    if (title) {
      query.title = new RegExp(title, 'i'); // Case-insensitive search by title
    }

    return this.moduleModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findOne(id: string) {
    return this.moduleModel.findById(id).exec();
  }

  async update(id: string, data: UpdateModuleDto, file?: Express.Multer.File) {
    const existing = await this.moduleModel.findById(id).exec();
    if (!existing) throw new NotFoundException('Module not found');

    if (file) {
      const uploadResult = await this.uploadToCloudinary(file);
      data.imageUrl = uploadResult.secure_url;
    }

    return this.moduleModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    return this.moduleModel.findByIdAndDelete(id).exec();
  }

  private uploadToCloudinary(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'modules' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      const readStream = new Readable();
      readStream.push(file.buffer);
      readStream.push(null);
      readStream.pipe(uploadStream);
    });
  }
}
