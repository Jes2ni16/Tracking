"use client"; // Enables client-side rendering for this component.
import React, { useEffect, useState } from 'react'; // Import React, useEffect, and useState for component lifecycle and state management.
import { useParams } from 'next/navigation'; // Import useParams to access dynamic route parameters in Next.js.
import styles from './page.module.css'; // Import CSS module for styling.

// Define the Document interface to describe the structure of a document object.
interface Document {
    trackingNumber: string;
    filename: string;
    status: string;
}

// RegisterForm component to fetch and display document details based on tracking ID.
const RegisterForm: React.FC = () => {
    // Extract the 'id' parameter from the route using useParams.
    const { id } = useParams();

    // Define state variables for document status, error messages, loading state, and the document data itself.
    const [status, setStatus] = useState<string>('');;
    const [error, setError] = useState<string>(''); // Holds any error messages.
    const [loading, setLoading] = useState<boolean>(true);; // Flag for loading state.
    const [document, setDocument] = useState<Document | null>(null); // Holds the fetched document or null.

    // useEffect hook to fetch document data when the component mounts or when 'id' changes.
    useEffect(() => {
        const fetchData = async () => {
          try {
            // Make an API request to fetch document details based on the tracking ID.
            const response = await fetch(`https://tracking-server-9kmt.onrender.com/api/view/${id}`);
            if (response.ok) { // If response is successful, update document state.
              const data = await response.json();
              setDocument(data);
              setStatus(''); // Clear status message.
              setLoading(false); // Set loading to false after fetching data.
              setError(''); // Clear any previous error messages.
            } else { // Handle non-successful responses (e.g., document not found).
              const errorData = await response.json();
              setDocument(null); // Set document to null if not found.
              setStatus(''); // Clear status message.
              setError(errorData.error || 'Document not found'); // Set error message.
            }
          } catch (err) {
            // Catch block for handling network or server errors.
            setDocument(null); // Set document to null on error.
            setStatus(''); // Clear status message.
            setError('Failed to fetch document'); // Set error message for fetch failure.
          }
        };
    
        // Only fetch data if 'id' is present.
        if (id) {
          fetchData();
        }
      }, [id]); // Dependency array to trigger the effect when 'id' changes.

  // Render the component's UI
  return (
    <main>
      {/* Display loading message while data is being fetched */}
      { loading ? (
        <div className={styles.loading}>Loading...</div> // Show a loading indicator while fetching.
      ) : (
        document && ( // Once the document is loaded, display the document details.
          <div className={styles.wrapper}>
            <h3>Tracking Number: {document?.trackingNumber}</h3> {/* Display the tracking number */}
            <h3>Requested File: {document?.filename}</h3> {/* Display the filename */}
            <h3>Status: {document?.status}</h3> {/* Display the document status */}
          </div>
        )
      )}

      {/* Display error message if any */}
      {error && (
        <h2>
          {error}
        </h2>
      )}
    </main>
  );
};

export default RegisterForm; // Export the component as default.
