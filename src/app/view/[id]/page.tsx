"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './page.module.css'

interface Document {
    trackingNumber: string;
    filename: string;
    status: string;
  }

const RegisterForm: React.FC = () => {
    const { id } = useParams();
    const [status, setStatus] = useState<string>('');;
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);;
    const [document, setDocument] = useState<Document | null>(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`https://tracking-server-9kmt.onrender.com/api/view/${id}`);
            if (response.ok) {
              const data = await response.json();
              setDocument(data);
              setStatus('');
              setLoading(false)
              setError('');
            } else {
              const errorData = await response.json();
              setDocument(null);
              setStatus('');
              setError(errorData.error || 'Document not found');
            }
          } catch (err) {
            setDocument(null);
            setStatus('');
            setError('Failed to fetch document');
          }
        };
    
        if (id) {
          fetchData();
        }
      }, [id]);


  return (
    <main>
{ loading ? (
                <div className={styles.loading}>Loading...</div>
            ) : (
                document && (
                    <div className={styles.wrapper}>
                        <h3>Tracking Number: {document?.trackingNumber}</h3>
                        <h3>Requested File: {document?.filename}</h3>
                        <h3>Status: {document?.status}</h3>
                    </div>
                )
            )}
        
   {error && (
    <h2>
        {error}
    </h2>
   )  }
    </main>
  );
};

export default RegisterForm;
