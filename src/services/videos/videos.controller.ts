import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateVideoDto } from '../dto/create-video.dto';
import { VideosService } from './videos.service';
import { MulterFile } from 'multer';
import { AwsS3Service } from '../aws-s3';
import { ConfigService } from '@nestjs/config';


@Controller('videos')
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly awsS3Service: AwsS3Service,
    private readonly configService: ConfigService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: MulterFile, @Body() createVideoDto: CreateVideoDto): Promise<any> {
    console.log('File:', file); // Add this line to check the value of the "file" object
    console.log('typeof file:', typeof file); // Add this line to check the type of the "file" object

    if (!file || !file.buffer) {
      console.log('File or buffer is missing.');
      // Handle the error or return an appropriate response
      return;
    }
    console.log('CreateVideoDto:', createVideoDto);
    const bucketName = this.configService.get('AWS_PRIVATE_BUCKET_NAME'); // Replace with your actual S3 bucket name
    const originalFileName = file.originalname;

    console.log('File Buffer:', file.buffer); // Add this line to check the value of the "file.buffer" property
    const key = await this.awsS3Service.uploadFile(file.buffer, bucketName, originalFileName);

    // Use the key or the file URL returned by the uploadFile method as needed
    // For example, save the key to your database for future reference or return it in the response

    const video = await this.videosService.createVideo(createVideoDto, key, file.buffer);
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
