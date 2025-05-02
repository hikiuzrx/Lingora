import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Patch,
    Delete,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    ParseUUIDPipe,
    Query,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { ModuleService } from './module.service';
  import { CreateModuleDto } from './dtos/create-module.dto';
  import { UpdateModuleDto } from './dtos/update-module.dto';
  import { JwtGuard } from '../auth/auth.guard'
  import { Express } from 'express';
  
  @ApiTags('Modules')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Controller('modules')
  export class ModuleController {
    constructor(private readonly moduleService: ModuleService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a module' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          imageUrl: { type: 'string', format: 'binary' },
        },
        required: ['title'],
      },
    })
    @ApiResponse({ status: 201, description: 'Module created successfully.' })
    @UseInterceptors(FileInterceptor('imageUrl'))
    async create(
      @Body() body: CreateModuleDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      return this.moduleService.create(body, file);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all modules with pagination' })
    @ApiResponse({ status: 200, description: 'Returns a list of modules.' })
    async findAll(
      @Query('page') page: number = 1, // Default page is 1
      @Query('limit') limit: number = 10, // Default limit is 10
      @Query('title') title?: string, // Optional filter by title
    ) {
      return this.moduleService.findAll(page, limit, title);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get module by ID' })
    @ApiResponse({ status: 200, description: 'Returns a module.' })
    async findOne(@Param('id') id: string) {
      return this.moduleService.findOne(id);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a module' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          imageUrl: { type: 'string', format: 'binary' },
        },
      },
    })
    @UseInterceptors(FileInterceptor('imageUrl'))
    async update(
      @Param('id') id: string,
      @Body() body: UpdateModuleDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      return this.moduleService.update(id, body, file);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a module' })
    @ApiResponse({ status: 200, description: 'Module deleted successfully.' })
    async delete(@Param('id') id: string) {
      return this.moduleService.delete(id);
    }
  }
  