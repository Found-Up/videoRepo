import { Module } from '@nestjs/common';
import { AwsS3Module } from '../aws-s3/aws-s3.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from '../entities/video.entity';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';


@Module({
  imports: [
    AwsS3Module,
    TypeOrmModule.forFeature([Video]),
  ],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
