
import { IsString, IsNotEmpty } from 'class-validator';
import type { File } from 'multer-s3';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsNotEmpty()
  readonly file: File;
}
