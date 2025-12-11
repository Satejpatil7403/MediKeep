import React, { useState } from 'react';
import { uploadDocument } from '../services/api';

const DocumentUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage('');
            setIsError(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file');
            setIsError(true);
            return;
        }
        if (file.type !== 'application/pdf') {
            setMessage('Only PDF files are allowed');
            setIsError(true);
            return;
        }

        setUploading(true);
        try {
            await uploadDocument(file);
            setMessage('Document uploaded successfully!');
            setIsError(false);
            setFile(null);
            // Reset file input
            const fileInput = document.getElementById('file-input');
            if (fileInput) fileInput.value = '';

            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            setMessage('Upload failed. Please try again.');
            setIsError(true);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="card upload-container">
            <h2 className="upload-title">Upload New Document</h2>
            <form onSubmit={handleUpload}>
                <div className="upload-zone">
                    <input
                        id="file-input"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                    <label htmlFor="file-input" className="upload-label">
                        <span className="upload-icon">📄</span>
                        <div className="upload-text">
                            {file ? file.name : "Click to select a PDF file"}
                        </div>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={uploading || !file}
                    className="btn btn-primary"
                >
                    {uploading ? 'Uploading...' : 'Upload Document'}
                </button>
            </form>
            {message && (
                <div className={`message ${isError ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;
