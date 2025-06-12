import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const documentsTable = pgTable('documents', {
  id: serial().primaryKey(), // NOT IDEAL FOR PRODUCTION -> Could be replaced with some unique non-incrementing id
  title: text(),
  decisionType: text(),
  dateOfDecision: text(),
  office: text(),
  court: text(),
  caseNumber: text(),
  summaryAndConclusion: text(),
});
