import { Injectable } from '@nestjs/common';
import db from 'db/db';
import { documentsTable } from 'db/schema';
import { eq } from 'drizzle-orm';

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
export class DocumentService {
  async saveDocument(data: Data) {
    const [document] = await db.insert(documentsTable).values(data).returning();
    return document.id;
  }

  async getDocumentById(id: number) {
    const [document] = await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.id, id));

    return document;
  }
}
