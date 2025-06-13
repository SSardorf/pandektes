import { Injectable } from '@nestjs/common';
import db from 'db/db';
import { documentsTable } from 'db/schema';
import { and, eq, ilike, or } from 'drizzle-orm';

export interface Data {
  title: string;
  decisionType: string;
  dateOfDecision: string;
  office: string;
  court: string;
  caseNumber: string;
  summaryAndConclusion: string;
}

type DocumentFilters = {
  query?: string;
  court?: string;
  office?: string;
  decisionType?: string;
  dateOfDecision?: string;
  caseNumber?: string;
  limit?: number;
};

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

  async getDocumentsByFilters(filters: DocumentFilters) {
    const whereClauses = [];

    if (filters.query) {
      whereClauses.push(
        or(
          ilike(documentsTable.title, `%${filters.query}%`),
          ilike(documentsTable.summaryAndConclusion, `%${filters.query}%`),
        ),
      );
    }

    if (filters.court) {
      whereClauses.push(ilike(documentsTable.court, `%${filters.court}%`));
    }
    if (filters.office) {
      whereClauses.push(ilike(documentsTable.office, `%${filters.office}%`));
    }
    if (filters.decisionType) {
      whereClauses.push(
        ilike(documentsTable.decisionType, `%${filters.decisionType}%`),
      );
    }
    if (filters.dateOfDecision) {
      whereClauses.push(
        ilike(documentsTable.dateOfDecision, `%${filters.dateOfDecision}%`),
      );
    }
    if (filters.caseNumber) {
      whereClauses.push(
        ilike(documentsTable.caseNumber, `%${filters.caseNumber}%`),
      );
    }

    const where = whereClauses.length > 0 ? and(...whereClauses) : undefined;

    return await db
      .select()
      .from(documentsTable)
      .where(where)
      .limit(filters.limit ?? 5);
  }
}
