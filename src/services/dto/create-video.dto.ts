
import { IsString, IsNotEmpty } from 'class-validator';
import type { File } from 'multer';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsNotEmpty()
  readonly file: File;
}
