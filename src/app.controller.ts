import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
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
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    let data: Data;
    if (file.mimetype === 'application/pdf') {
      data = await this.appService.parsePDFFile(file);
    } else if (file.mimetype === 'text/html') {
      data = await this.appService.parseHTMLFile(file);
    } else {
      throw new BadRequestException('Invalid file type');
    }

    const id = await this.documentService.saveDocument(data);

    return {
      id: id,
    };
  }

  @Get('document')
  async getDocuments(
    @Query('query') query?: string,
    @Query('court') court?: string,
    @Query('office') office?: string,
    @Query('decisionType') decisionType?: string,
    @Query('dateOfDecision') dateOfDecision?: string,
    @Query('caseNumber') caseNumber?: string,
    @Query('limit') limit?: number,
  ) {
    const filters = {
      query,
      court,
      office,
      decisionType,
      dateOfDecision,
      caseNumber,
      limit,
    };
    const docs = await this.documentService.getDocumentsByFilters(filters);
    return docs;
  }

  @Get('document/:id')
  async getDocumentById(@Param('id') id: string) {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new BadRequestException('Invalid id');
    }

    const doc = await this.documentService.getDocumentById(numId);

    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    return doc;
  }
}
