import { Controller, Get, Post, UploadedFile, UseInterceptors, Body, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/files.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Express } from 'express';
import { Multer } from 'multer';
import { multerOptions } from 'src/config/multer.config';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() createFileDto: CreateFileDto,
    ) {
        return this.filesService.create({
            ...createFileDto,
            file_name: file.originalname,
            file_type: file.mimetype,
        });
    }


    @Get()
    findAll() {
        return this.filesService.findAll();
    }

    @Get('project/:projectId')
    findByProject(@Param('projectId') projectId: string) {
        return this.filesService.findByProject(+projectId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.filesService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.filesService.remove(+id);
    }
}