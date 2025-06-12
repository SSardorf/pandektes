import { Injectable } from '@nestjs/common';
import { Window } from 'happy-dom';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createGroq } from '@ai-sdk/groq';
import pdfParse from 'pdf-parse';

const groq = createGroq({
  // custom settings
  apiKey: process.env.GROQ_API_KEY,
});

const model = groq.languageModel('llama-3.1-8b-instant');

export interface Data {
  title: string;
  decisionType: string;
  dateOfDecision: string;
  office: string;
  court: string;
  caseNumber: string;
  summaryAndConclusion: string;
}

@Injectable()
export class AppService {
  async parseHTMLFile(file: Express.Multer.File) {
    const html = file.buffer.toString('utf8');
    const domParser = new new Window().DOMParser();

    const dom = domParser.parseFromString(html, 'text/html');

    const text = dom.body.textContent;

    return await this.processTextContent(text);
  }

  async parsePDFFile(file: Express.Multer.File): Promise<Data> {
    const pdfRead = await pdfParse(file.buffer);

    const data = this.processTextContent(pdfRead.text);

    return data;
  }

  private async processTextContent(text: string): Promise<Data> {
    const schema = z.object({
      title: z.string(),
      decisionType: z.string(),
      dateOfDecision: z.string(),
      office: z.string(),
      court: z.string(),
      caseNumber: z.string(),
      summaryAndConclusion: z.string(),
    });

    const data = await generateObject({
      model,
      schema,
      prompt: `Please extract the following information from the text:
      Title:
      Decision Type:
      Date of Decision:
      Office:
      Court:
      Case Number:
      Summary and Conclusion:
      
      ${text}
      `,
    });

    return data.object;
  }
}
