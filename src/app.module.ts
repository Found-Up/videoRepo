import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './datasources/config/ormconfig';
import { VideosModule } from './services/videos/videos.module';
import { MulterModule } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer';




@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: ormconfig,
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: multerS3({
          s3: new AWS.S3({
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          }),
          bucket: configService.get('AWS_PRIVATE_BUCKET_NAME'),
          acl: 'private-read', // Specify the access control for the uploaded files
          contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set the content type based on the file
          key: (req, file, cb) => {
            cb(null, `${Date.now().toString()}-${file.originalname}`); // Generate a unique key for the uploaded file
          },
        }),
      }),
      inject: [ConfigService],
    }),
    VideosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


