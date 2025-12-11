1. Tech Stack Choices
Q1. What frontend framework did you use and why?

React — chosen because:

Component-based architecture maps cleanly to UI pieces (upload form, file list, toast messages).
Simple to wire to REST APIs and easy to style for a clean, responsive UI.

Q2. What backend framework did you choose and why?

FastAPI — chosen because:

Fast to build and prototype (declarative route definitions, automatic OpenAPI docs).
Lightweight and production-ready (can be deployed with Uvicorn/Gunicorn).

Q3. What database did you choose and why?

SQLite  — chosen because:

Zero-setup, file-based DB ideal for local demos and small projects.
Fast enough for single-user or small-scale testing.

Q4. If you were to support 1,000 users, what changes would you consider?

Scale storage & database: Move file storage from local uploads/ to S3/MinIO and switch the database from SQLite to PostgreSQL with proper indexing and migrations.
Improve performance & reliability: Run multiple backend instances behind a load balancer (Gunicorn + Uvicorn), enable async streaming for uploads/downloads, add Redis caching, and paginate file results.


2. Architecture Overview

Flow:

Upload

Frontend sends POST /documents multipart/form-data with PDF.
Backend validates file (MIME + extension), writes bytes to uploads/ with unique stored name.
Backend inserts metadata row into documents table (filename, filepath, filesize, created_at) and returns metadata.
Frontend refreshes list and shows success message.

List

Frontend calls GET /documents.
Backend queries SQLite documents table and returns list.
Frontend renders table.

Download
Frontend requests GET /documents/{id}.
Backend finds row, reads file from uploads/, returns FileResponse with original filename and application/pdf.
Browser downloads file.

Delete

Frontend calls DELETE /documents/{id}.
Backend deletes file from disk and removes DB row. Returns success.
Frontend updates UI.


3. API Specification

POST /documents

multipart/form-data with PDF file.

Returns document metadata (id, filename, filepath, filesize, created_at).

GET /documents

Returns list of document metadata (id, filename, filesize, created_at).

GET /documents/{id}

Returns FileResponse with original filename and application/pdf.

DELETE /documents/{id}

Deletes document from disk and DB. Returns success.

4. Data Flow Description
Q5. Describe the step-by-step process of what happens when a file is uploaded and when it is downloaded.

Upload
Frontend sends POST /documents multipart/form-data with PDF.
Backend validates file (MIME + extension), writes bytes to uploads/ with unique stored name.
Backend inserts metadata row into documents table (filename, filepath, filesize, created_at) and returns metadata.
Frontend refreshes list and shows success message.

Download
Frontend requests GET /documents/{id}.
Backend finds row, reads file from uploads/, returns FileResponse with original filename and application/pdf.
Browser downloads file.

5. Assumptions
Q6. What assumptions did you make while building this? (e.g., file size limits, authentication,concurrency)

Assumptions:

File size limit: 10MB (chosen for simplicity, can be adjusted).
No authentication required (chosen for simplicity, can be added).
Single-user concurrency (chosen for simplicity, can be scaled).

