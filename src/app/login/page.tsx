"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './page.module.css'

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();


  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault(); 
  
   
        const res = await fetch('http://localhost:8000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });     
  
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('userId', data.user.id);
          console.log(data.user.role)
          console.log(data.accessToken)
          console.log(data.user.role)
        
           
          //  const userId = data.user.id; 
          if (data.user.role === 'admin') {
            router.push(`/admin/`);
          }else if(data.user.role === 'student'){
            router.push(`/user/${data.user.id}`);
          }else{
            router.push(`/user/${data.user.id}`);
          }

            // Redirect to the user's profile page using their ID
    

          } else {
            // Handle login failure
            setError('Login failedss');
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
        {error && <p>{error}</p>}
      </form>
      </div>
    </div>
    </div>
  );
}