// src/lessons/lesson.controller.ts
import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Put,
    Delete,
    Res,
    UseGuards,
    HttpCode,
    HttpStatus,
    Query
  } from '@nestjs/common';
  import { LessonService } from './lessons.service';
  import { CreateLessonDto } from './dtos/create-lesson.dto';
  import { UpdateLessonDto } from './dtos/update-lesson.dto';
  import { JwtGuard } from '../auth/auth.guard';
  import { Response } from 'express';
  import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse,ApiQuery } from '@nestjs/swagger';
  
  @ApiTags('Lessons')
  @ApiBearerAuth()
  @Controller('lessons')
  @UseGuards(JwtGuard,)
  export class LessonController {
    constructor(private readonly lessonService: LessonService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new lesson' })
    @ApiResponse({ status: 201, description: 'Lesson created successfully' })
    async create(@Body() createLessonDto: CreateLessonDto,) {
    const lesson=  await this.lessonService.create(createLessonDto);
    return lesson
        
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all lessons' })
    @ApiResponse({ status: 200, description: 'Return all lessons' })
    async findAll() {
      return this.lessonService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a lesson by ID' })
    @ApiResponse({ status: 200, description: 'Return lesson by ID' })
    async findById(@Param('id') id: string) {
      return this.lessonService.findById(id);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get lessons by module ID' })
    @ApiQuery({ name: 'moduleId', required: true, description: 'ID of the module' })
    @ApiResponse({ status: 200, description: 'Return lessons in the module' })
    async findByModuleId(@Query('moduleId') moduleId: string) {
      return this.lessonService.findByModuleId(moduleId);
    }
    @Get('/module-title/:title')
    @ApiOperation({ summary: 'Get lessons by module title' })
    @ApiResponse({ status: 200, description: 'Return lessons by module title' })
    async findLessonsByModuleTitle(@Param('title') title: string) {
      return this.lessonService.findLessonsByModuleTitle(title);
    }
  
    @Get('/title/:title')
    @ApiOperation({ summary: 'Get a lesson by title' })
    @ApiResponse({ status: 200, description: 'Return lesson by title' })
    async findByTitle(@Param('title') title: string) {
      return this.lessonService.findByTitle(title);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update a lesson by ID' })
    @ApiResponse({ status: 200, description: 'Lesson updated successfully' })
    async update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
      return this.lessonService.update(id, updateLessonDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a lesson by ID' })
    @ApiResponse({ status: 204, description: 'Lesson deleted successfully' })
    async remove(@Param('id') id: string) {
      await this.lessonService.remove(id);
    }
  }
  