from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import shutil
import os
from backend import database
from backend import crud
from models import *
from schemas import *
from crud import *
from database import *
import aiofiles

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Ensure absolute path for uploads directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.post("/upload/", response_model=schemas.Document)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save file
    async with aiofiles.open(file_location, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
        
    filesize = os.path.getsize(file_location)
    
    document_data = schemas.DocumentCreate(
        filename=file.filename,
        filepath=file_location,
        filesize=filesize
    )
    
    return crud.create_document(db=db, document=document_data)

@app.get("/documents/", response_model=list[schemas.Document])
def list_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    documents = crud.get_documents(db, skip=skip, limit=limit)
    return documents

@app.get("/documents/{document_id}/download")
def download_document(document_id: int, db: Session = Depends(get_db)):
    document = crud.get_document(db, document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return FileResponse(document.filepath, filename=document.filename, media_type='application/pdf')

@app.delete("/documents/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    document = crud.get_document(db, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Delete file from filesystem
    if os.path.exists(document.filepath):
        try:
            os.remove(document.filepath)
        except Exception as e:
            print(f"Error deleting file: {e}")
            # Continue to delete from DB even if file deletion fails
        
    crud.delete_document(db, document_id)
    return {"message": "Document deleted successfully"}
