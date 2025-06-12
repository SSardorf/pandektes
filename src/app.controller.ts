import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService, Data } from './app.service';
import { DocumentService } from './document/document.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly documentService: DocumentService,
  ) {}

  @Post('document')
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

    const id = await this.documentService.saveDocument(data);

    return {
      id: id,
    };
  }

  @Get('document/:id')
  async getDocumentById(@Param('id') id: string) {
    return await this.documentService.getDocumentById(parseInt(id));
  }
}
