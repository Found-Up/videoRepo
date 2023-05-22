import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { MulterFile } from 'multer';


@Injectable()
export class AwsS3Service {
  private s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
      signatureVersion: 'v4',
    });
  }

  async uploadFile(
    fileBuffer: Buffer,
    bucketName: string,
    originalFileName: string,
  ): Promise<string> {
    console.log('File Buffer:', fileBuffer); // Add this line to check the value of the "fileBuffer" parameter
    const fileId = uuidv4();
    const key = `${fileId}-${originalFileName}`;
    console.log('fileBuffer.buffer:', fileBuffer.buffer);
    const params: S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
    };
    await this.s3.upload(params).promise();
    return key;
  }
  

  async getFileUrl(key: string, bucketName: string): Promise<string> {
    const url = await this.s3.getSignedUrlPromise('getObject', {
      Bucket: bucketName,
      Key: key,
      Expires: 60 * 60, // URL expires in 1 hour
    });
    return url;
  }
}
