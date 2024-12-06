"use client"; // This enables client-side rendering for this component.
import styles from "./page.module.css"; // Importing CSS module for styling.
import { useState } from "react"; // Importing useState hook for managing component state.
import { useRouter } from 'next/navigation'; // Importing Next.js useRouter for navigation.
import Head from 'next/head'; // Importing Head component to modify the HTML head (e.g., for the title).

// Home Component
export default function Home() {
  // State variables for tracking number, status, and error messages.
  const [trackingNumber, setTrackingNumber] = useState<string>('');;
  const [status, setStatus] = useState<string>('');;
  const [error, setError] = useState<string>('');;

  const router = useRouter(); // Getting the router instance for client-side navigation.

  // Function to handle input changes in the tracking number field.
  const handleInputChange = (e:any) => {
    setTrackingNumber(e.target.value); // Update tracking number state on input change.
  };

  // Function to handle form submission when the submit button is clicked.
  const handleButtonClick = async () => {
    if (!trackingNumber) { // If tracking number is empty, set error message.
      setError('Tracking number is required');
      setStatus(''); // Clear any previous status message.
      return;
    }

    try {
      // Sending a fetch request to the API endpoint based on the tracking number.
      const response = await fetch(`/view/${trackingNumber}`);
      if (response.ok) { // If response is successful, navigate to the document view page.
        router.push(`/view/${trackingNumber}`)
      } else { // If response fails, show an error message.
        const errorData = await response.json();
        setStatus(''); // Clear status message.
        setError(errorData.error || 'Document not found'); // Display error from response or fallback message.
      }
    } catch (err) {
      // Catch block for handling any network or server errors.
      setStatus(''); // Clear status message.
      setError('Failed to fetch status'); // Set error message for fetch failure.
    }
  };

  // Render the component
  return (
    <>
      {/* Head component to manage page title and metadata */}
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Welcome to the Home Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}> {/* Main content section with styling */}

        <div className={styles.box}> {/* Container for the logo, title, and input box */}
          <img src="/logo-philsca.png" alt="" className={styles.logo} /> 
          <h1> PHILSCA MEDELLIN TRACKING SYSTEM OF ACADEMIC CREDENTIALS</h1> {/* Title */}

          <div className={styles.authWrap}> {/* Container for the tracking input and buttons */}
            <div className={styles.track}> {/* Input and submit button */}
              <input type="text" placeholder="Enter a Tracking Number"
              value={trackingNumber} // Binding the input value to trackingNumber state.
              onChange={handleInputChange} // Handling input change.
              />    
              <button type="submit" onClick={handleButtonClick}> Submit</button> {/* Submit button */}
            </div>
            {/* Login and Register links */}
            <a href="/login" className={styles.login}>Login</a>
            <a href="/register" className={styles.register}>Register</a>
          </div>
        </div>

      </main>
    </>
  );
}
