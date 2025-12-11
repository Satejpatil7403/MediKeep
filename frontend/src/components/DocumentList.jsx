import React, { useEffect, useState } from 'react';
import { getDocuments, deleteDocument, getDownloadUrl } from '../services/api';

const DocumentList = ({ refreshTrigger }) => {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, [refreshTrigger]);

    const fetchDocuments = async () => {
        try {
            const response = await getDocuments();
            setDocuments(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch documents');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;
        try {
            await deleteDocument(id);
            fetchDocuments();
        } catch (err) {
            alert('Failed to delete document');
        }
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <div className="card document-list-container">
            <div className="list-header">
                <h2 className="list-title">My Documents</h2>
                <span className="badge">{documents.length} Files</span>
            </div>

            {error && <div className="message error">{error}</div>}

            {documents.length === 0 ? (
                <div className="empty-state">
                    <p>No documents uploaded yet.</p>
                </div>
            ) : (
                <div className="document-table-container">
                    <table className="document-table">
                        <thead>
                            <tr>
                                <th>Document Name</th>
                                <th>Size</th>
                                <th>Uploaded Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.id}>
                                    <td>
                                        <div className="file-name">
                                            <span className="file-icon">📄</span>
                                            {doc.filename}
                                        </div>
                                    </td>
                                    <td>{formatBytes(doc.filesize)}</td>
                                    <td>{new Date(doc.created_at).toLocaleDateString()} {new Date(doc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <a href={getDownloadUrl(doc.id)} download className="btn btn-sm btn-download">
                                                Download
                                            </a>
                                            <button onClick={() => handleDelete(doc.id)} className="btn btn-sm btn-delete">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DocumentList;
