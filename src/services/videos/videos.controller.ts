import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateVideoDto } from '../dto/create-video.dto';
import { VideosService } from './videos.service';
import { MulterFile } from 'multer';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: MulterFile, @Body() createVideoDto: CreateVideoDto): Promise<any> {
    const video = await this.videosService.createVideo(createVideoDto, file);
    return { video };
  }

  @Get()
  async getAllVideos(): Promise<any> {
    const videos = await this.videosService.findAll();
    return { videos };
  }

  @Get(':id')
  async getVideoById(@Param('id') id: number): Promise<any> {
    const video = await this.videosService.findById(id);
    return { video };
  }
}
