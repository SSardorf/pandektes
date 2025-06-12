CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"decisionType" text,
	"dateOfDecision" text,
	"office" text,
	"court" text,
	"caseNumber" text,
	"summaryAndConclusion" text
);
