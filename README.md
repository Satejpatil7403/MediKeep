MediKeep: A Patient Document Portal
A simple full-stack application that allows patients to upload, view, download, and delete medical PDF documents such as prescriptions, reports, and referral notes.
Built using React (frontend), FastAPI (backend), SQLite (database), and local file storage for uploaded documents.

🚀 Project Overview
This project provides:
📤 Upload PDFs (with validation)
📄 List all uploaded documents
⬇️ Download documents
❌ Delete documents
💾 Local file storage in an uploads/ directory
🗄️ Metadata stored in SQLite in a documents table
⚡ FastAPI backend with REST APIs
🎨 React frontend with clean UI and status messages

🛠️ Tech Stack
Frontend-> React (Vite)
Backend -> FastAPI (Python)
Database-> SQLite
Storage	-> Local /uploads folder
API Format->REST (JSON)

🔧 How to Run Locally
1. Clone the project
git clone https://github.com/Satejpatil7403/MediKeep.git
cd MediKeep

Backend Setup (FastAPI)
2. Install dependencies
     cd backend
     pip install -r requirements.txt

If you don’t have a requirements.txt, use:
pip install fastapi uvicorn sqlalchemy python-multipart

3. Run the backend server
uvicorn main:app --reload
Backend runs at:
👉 http://localhost:8000

Frontend Setup (React)
4. Install frontend dependencies
cd ../frontend
npm install

5. Start the React dev server
npm run dev
Frontend will be available at:
👉 http://localhost:5173

📡 API Endpoints
1. Upload Document
POST /documents
Curl Example
curl -X POST http://localhost:8000/documents \
  -F "file=@prescription.pdf"

2. List All Documents
GET /documents
curl http://localhost:8000/documents

Response example:
[
  {
    "id": 1,
    "filename": "prescription.pdf",
    "filepath": "uploads/20240212_121233_prescription.pdf",
    "filesize": 24566,
    "created_at": "2025-02-12T10:22:54.123Z"
  }
]

4. Download a Document
GET /documents/{id}
curl -O http://localhost:8000/documents/1
This downloads the PDF file.

5. Delete a Document
DELETE /documents/{id}
curl -X DELETE http://localhost:8000/documents/1
Response:
{ "message": "Document deleted successfully" }

🎯 Future Enhancements
User authentication (JWT/OAuth)
Cloud storage (S3/MinIO)
PostgreSQL database
File preview & search
Virus scanning before saving
