from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    filepath = Column(String)
    filesize = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
