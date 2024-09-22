"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './page.module.css'

export default function Login() {
    const [email, setEmail] = useState<string>(''); // State for email input
    const [password, setPassword] = useState<string>(''); // State for password input
    const [error, setError] = useState<string | null>(null); // State for error messages
    const router = useRouter(); // Initialize router for navigation

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault(); // Prevent default form submission behavior
  
        const res = await fetch('https://tracking-server-9kmt.onrender.com/api/users/login', {
            method: 'POST', // Set HTTP method to POST
            headers: {
                'Content-Type': 'application/json', // Specify JSON content type
            },
            body: JSON.stringify({ email, password }), // Prepare body data with email and password
        });     

        if (res.ok) { // Check if response is OK
            const data = await res.json(); // Parse successful response
            localStorage.setItem('accessToken', data.accessToken); // Store access token in localStorage
            localStorage.setItem('userId', data.user.id); // Store user ID in localStorage

            // Check user role and redirect accordingly
            if (data.user.role === 'admin') {
                router.push(`/admin/`); // Redirect to admin page if user is an admin
            } else if (data.user.role === 'student') {
                router.push(`/user/${data.user.id}`); // Redirect to student's profile page
            } else {
                router.push(`/user/${data.user.id}`); // Fallback to user's profile page
            }
        } else {
            // Handle login failure
            setError('Login failedss'); // Set error message for failed login
        }
    };


  return (
    <div className={styles.body}>
      <div className={styles.box}>
        
        <img src="/logo-philsca.png" alt="logo" className={styles.logo} />
        <div className={styles.formArea}>
      <h1>Login Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
         
          <input
            id="email"
            type="text"
            placeholder='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          
          <input
            id="password"
            type="password"
             placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
   <div className={styles.noAccount}>
   <a href="/register">Don&apos;t have an Account?</a>
   </div>
        {error && <p className='failed'>Incorrect Password or Email</p>}
      </form>
      </div>
    </div>
    </div>
  );
}