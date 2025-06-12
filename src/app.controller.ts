import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService, Data } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    let data: Data;
    if (file.mimetype === 'application/pdf') {
      data = await this.appService.parsePDFFile(file);
    } else if (file.mimetype === 'text/html') {
      data = await this.appService.parseHTMLFile(file);
    } else {
      return {
        message: 'Invalid file type',
      };
    }

    console.log(data);

    console.log('TODO: Save data to database');

    return {
      message: 'File uploaded successfully',
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
