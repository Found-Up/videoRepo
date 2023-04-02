import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { CreateVideoDto } from '../dto/create-video.dto';
import { Video } from '../entities/video.entity';
import { MulterFile } from 'multer';


@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    private awsS3Service: AwsS3Service,
  ) {}

  async createVideo(createVideoDto: CreateVideoDto, file: MulterFile): Promise<Video> {
    const video = new Video();
    video.title = createVideoDto.title;
    video.description = createVideoDto.description;
    const fileBuffer = file.buffer;
    const originalFileName = file.originalname;
    const bucketName = 'your-bucket-name';
    video.url = await this.awsS3Service.uploadFile(fileBuffer, bucketName, originalFileName);

    return this.videosRepository.save(video);
  }

  async findAll(): Promise<Video[]> {
    return this.videosRepository.find();
  }

  async findById(id: number | FindOneOptions<Video>): Promise<Video> {
    const options = typeof id === 'number' ? { where: { id } } : id;
    return this.videosRepository.findOne(options);
  }
  
  
}
