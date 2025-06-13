### How to run the project:

```bash
docker-compose up --build
```

### How to upload a file:

```bash
curl -X POST -F "file=@your-file.pdf" http://localhost:3000/document
```

or

```bash
curl -X POST -F "file=@your-file.html" http://localhost:3000/document
```

Currently only pdf and html files are supported.
The endpoint returns an id which can be used to retrieve the document.

### How to retrieve a document:

Retrieve document by id:

```bash
curl http://localhost:3000/document/1
```

Retrieve documents by filters:

```bash
curl http://localhost:3000/document?query=somequery
```

```bash
curl http://localhost:3000/document?court=somecourt
```

### Requirements before Production ready

- Authentication
- Architecture considerations → What is the usecase? Is this a multi-tenancy application where we should separate uploads based on who inputs
- Separation of services and controllers → Parser service and document service/controller
- Handling massive context lengths → Splitting documents and only using relevant content to determine output data
- Test coverage
- Document duplication checking
- Stricter types and database schema
  - Right now a lot of the data is stored as strings, and are optional. I imagine we’d want to strictly enforce the schema and types, and that we have some required fields.
- Changes to query-based filtering
  - Before the system is production ready, we’d need to massively change how the query filtering works. Right now it’s essentially a bunch of ilike statements that matches based on the query.
  - I imagine we’d want fixed values for things like “court” and “decision type”, etc.

### Tech choice notes

- AI SDK → The best abstraction I’ve used for interacting with LLMs in a TypeScript ecosystem
- Drizzle → My go-to ORM (would not use in production for critical systems until 1.0 is out though)
- Happydom → A faster and more lightweight alternative to jsdom
- Zod → Structured and validated data output
- PDF-parse → A PDF parser
