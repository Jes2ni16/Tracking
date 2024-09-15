"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css'

export interface File {
  originalName: string;
  mimeType: string;
  size: number;
  filePath: string;
}

interface Document {
  trackingNumber: string;
  copies: string;
  course: string;
  lastAttended: string;
  major: string;
  schoolName: string;
  updatedAt: string;
  purpose: string;
  createdAt: string;
  filename: string;
  createdByName: string;
  status: string;
  _id: string;

  files:File[];
}

const DocumentDetails = () => {
  console.log('DocumentDetails component rendered'); // Check if component is rendering

  const { id } = useParams();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Log useParams hook
  console.log('ID from useParams:', id);

  useEffect(() => {
    console.log('Token useEffect executed');
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const storedToken = localStorage.getItem('accessToken');
      console.log('Stored Token:', storedToken);
      setToken(storedToken);
    } else {
      console.error('localStorage is not available.');
    }
  }, []);

  useEffect(() => {
    if (!id || !token) return;

    console.log('Fetch useEffect executed with ID:', id, 'and Token:', token);

    const fetchDocument = async () => {
      try {
        const res = await fetch(`https://tracking-server-9kmt.onrender.com/api/documents/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        console.log('Fetch Response Status:', res.status);

        const data = await res.json();
        console.log('Fetch Response Data:', data);

        if (!res.ok) throw new Error(data.message || 'Document not found');

        setDocument(data);
      } catch (error) {
        console.error('Fetch Error:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, token]);

  console.log(document)

  const handleStatusChange = async (documentId:string, currentStatus:string) => {
    setLoading(true);
    setError(null);

    let newStatus;

    if (currentStatus === 'Draft') {
      newStatus = 'viewed';
    } else if (currentStatus === 'viewed') {
      newStatus = 'processing';
    } else if (currentStatus === 'processing') {
      newStatus = 'releasing';
    } else if (currentStatus === 'releasing') {
      newStatus = 'received';
    } else {
      // No further status changes or invalid status
      setLoading(false);
      return;
    }

    try {
      // Update document status
      const res = await fetch(`https://tracking-server-9kmt.onrender.com/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };


  const getButtonText = (status: string): string => {
    if (loading) return 'Processing...';

    switch (status) {
      case 'Draft':
        return 'Accept';
      case 'viewed':
        return 'Process';
      case 'processing':
        return 'Release';
      case 'releasing':
        return 'Complete';
      case 'received':
        return 'Reviewed';
      default:
        return 'Action';
    }
  };
  const basePath = "C:\\Users\\Jestoni PC\\Desktop\\New folder\\server\\uploads\\";
  function removeBasePath(fullPath: string, basePath: string): string {
    return fullPath.replace(basePath, '');
  }

  const transformedFiles = document?.files?.map(file => ({
    ...file,
    filePath: removeBasePath(file.filePath, basePath),
  }));
  console.log(transformedFiles)

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!document) return <p>No document found.</p>;

  return (
    <main className={styles.main}>
      <h1>Document Details</h1>
      <div className={styles.details}>
      <p className={styles.grid1}><strong>Document Type:</strong> {document.filename}</p>
      <p className={styles.grid2}><strong>Tracking Number:</strong> {document.trackingNumber}</p>
      <p className={styles.grid3}><strong>Status:</strong> {document.status}</p>
      <p className={styles.grid4}><strong>Purpose:</strong> {document.purpose}</p>
      <p className={styles.grid5}><strong>School in College:</strong> {document.schoolName}</p>
      <p className={styles.grid6}><strong>Last Attend Date:</strong> {document.lastAttended}</p>
      <p className={styles.grid7}><strong>Course:</strong> {document.course}</p>
      <p className={styles.grid8}><strong>Major:</strong> {document.major}</p>
      <p className={styles.grid9}><strong>Number of Copies:</strong> {document.copies}</p>
      <p className={styles.grid10}><strong>From:</strong> {document.createdByName}</p>
      <p className={styles.grid11}><strong>Date Requested:</strong> {new Date(document.createdAt).toLocaleDateString()}</p>
      <p className={styles.grid12}><strong>Updated Date:</strong>  {new Date(document.updatedAt).toLocaleDateString()}</p>
      <p className={styles.grid13}><strong>Requirements:</strong> </p>
      <ul>
      {transformedFiles?.map((file, index) => {
    const imagePath = `https://tracking-server-9kmt.onrender.com${file.filePath}`;
    console.log('Image Path:', imagePath);
    return <img key={index} src={imagePath} alt={`Image ${index}`} />;
})}

    </ul>
      </div>
      <div className={styles.buttons}>
      <button className={styles.button1}
      onClick={() => handleStatusChange(document._id, document.status)}
      disabled={loading}
    >
      {getButtonText(document.status)}
    </button>
                                        <button className={styles.button2}>Delete</button>

      </div>
    </main>
  );
};

export default DocumentDetails;
