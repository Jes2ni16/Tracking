"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Head from 'next/head';
export default function Home() {
  const [trackingNumber, setTrackingNumber] = useState<string>('');;
  const [status, setStatus] = useState<string>('');;
  const [error, setError] = useState<string>('');;


  const router = useRouter();

  const handleInputChange = (e:any) => {
    setTrackingNumber(e.target.value);
  };


  // Handle form submission
  const handleButtonClick = async () => {
    if (!trackingNumber) {
      setError('Tracking number is required');
      setStatus('');
      return;
    }

    try {
      const response = await fetch(`/view/${trackingNumber}`);
      if (response.ok) {
        router.push(`/view/${trackingNumber}`)

      } else {
        const errorData = await response.json();
        setStatus('');
        setError(errorData.error || 'Document not found');
      }
    } catch (err) {
      setStatus('');
      setError('Failed to fetch status');
    }
  };

  return (
    <>  <Head>
    <title>Home Page</title>
    <meta name="description" content="Welcome to the Home Page" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
    <main className={styles.main}>

    <div className={styles.box}>
      <img src="/logo-philsca.png" alt="" className={styles.logo} />
    <h1> PHILSCA MEDELLIN  TRACKING SYSTEM OF ACADEMIC CREDENTIALS</h1>

    <div className={styles.authWrap}>
      <div className={styles.track}>
      <input type="text" placeholder="Enter a Tracking Number"
      value={trackingNumber}
      onChange={handleInputChange}
      />    <button type="submit" onClick={handleButtonClick}> Submit</button>
      </div>
      <a href="/login" className={styles.login}>Login</a>
      <a href="/register" className={styles.register}>Register</a>
    </div>
    </div>

    </main>
    </>
  );
}
