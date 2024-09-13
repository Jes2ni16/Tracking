"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './page.module.css'


const RegisterForm: React.FC = () => {
  const router = useRouter();
  // State to hold form data
  const [studentId, setStudentId] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [birthPlace, setBirthPlace] = useState<string>('');
  const [sex, setSex] = useState<string>('');
  const [civil, setCivil] = useState<string>('');
  const [citizenship, setCitizenship] = useState<string>('');
  const [religion, setReligion] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [contact, setContact] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  
  // State to handle loading and errors
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Basic validation
    if (!email || !password ) {
      setError('All fields are required.');
      return;
    }
      
    if (!agreeTerms) {
        setError('You must agree to the terms and conditions.');
        return;
      }


      setLoading(true);
    setError(null);

 try {
  console.log('Starting fetch request');
  const res = await fetch('http://localhost:8000/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      student_id: studentId,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      birth_date: dob,
      birth_place: birthPlace,
      sex,
      civil_status: civil,
      citizenship,
      religion,
      address,
      email,
      contact,
      password,
    }),
  });

  console.log('Fetch response:', res);

  if (!res.ok) {
    const errorData = await res.json();
    setError(errorData.message || 'Registration failed.');
    return;
  }

  const data = await res.json();

    router.push(`/login`);
  

  // Clear form
  setEmail('');
  setPassword('');
  setStudentId('');
  setFirstName('');
  setLastName('');
  setMiddleName('');
  setDob('');
  setBirthPlace('');
  setSex('');
  setCitizenship('');
  setCivil('');
  setReligion('');
  setAddress('');
  setContact('');

} catch (err) {
  console.error('An error occurred:', err);
  setError('An error occurred during registration.');
} finally {
  setLoading(false);
}
  };



  return (
    <main>
      <div className={styles.box}>
        <a href="/"><img src="/logo-philsca.png" alt="" className={styles.logo} /></a>
        <h1>Registration Form</h1>
    <form onSubmit={handleSubmit}>
      <div className={styles.userDetails}>
         <div className={styles.inputBox} >
        <label  className={styles.label}>ID Number</label>
        <input
          id="studentId"
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
      </div>

      <div className={styles.inputBox}>
        <label htmlFor="firstName">First Name:</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className={styles.inputBox}>
        <label htmlFor="middleName">Middle Name:</label>
        <input
          id="middleName"
          type="text"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          required
        />
      </div>
      
      <div className={styles.inputBox}>
        <label htmlFor="lastName">Last Name:</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div className={styles.inputBox}>
        <label htmlFor="dob">Date of Brith:</label>
        <input
          id="dob"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
      </div>
      
      <div className={styles.inputBox}>
        <label htmlFor="birthPlace">Place of Brith</label>
        <input
          id="birthPlace"
          type="text"
          value={birthPlace}
          onChange={(e) => setBirthPlace(e.target.value)}
          required
        />
      </div>
      
      <div className={styles.inputBox}>
        <label htmlFor="sex">Sex: </label>
        <select
          id="sex"
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          required
        >
          <option value="" disabled>Select your sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          </select>
      </div>

      <div className={styles.inputBox}>
        <label htmlFor="civil">Civil Status: </label>
        <select
          id="civil"
          value={civil}
          onChange={(e) => setCivil(e.target.value)}
          required
        >
          <option value="" disabled>-- SELECT --</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="separated">Separated</option>
          <option value="annulled">Annulled</option>
          <option value="widow">Widow</option>
          <option value="divorced">Divorced</option>
          </select>
      </div>

      <div className={styles.inputBox}>
        <label htmlFor="citizenship">Citizenship: </label>
        <input
          id="citizenship"
          type="text"
          value={citizenship}
          onChange={(e) => setCitizenship(e.target.value)}
          required
        />
      </div>
      
      <div className={styles.inputBox}>
        <label htmlFor="religion">religion: </label>
        <input
          id="religion"
          type="text"
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
          required
        />
      </div>

      <div className={styles.inputBox}>
        <label htmlFor="address">Permanent Address: </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div className={styles.inputBox}>
        <label htmlFor="contact">Contact Number: </label>
        <input
          id="contact"
          type="number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
      </div>
      
      <div className={styles.inputBox}>
        <label htmlFor="email">Email: (Remember for Login)</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.inputBox}>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className={styles.agreementBox}>
    <input
      type="checkbox"
      id="agreement"
      className={styles.agreement}
      checked={agreeTerms}
      onChange={(e) => setAgreeTerms(e.target.checked)}
      required
    />
  <span> I agree to provide a complete and accurate information asked herein and allow the University to process it for any legal purpose. Withholding or giving false information will make me ineligible for admission or subject to dismissal from the university. If admitted, I agree to abide by the policies, rules and regulations of PHILSCA MACTAN-MEDELLIN.
  </span>  </div>
      
      <button type="submit" disabled={loading} className={styles.registerBtn}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}


      </div>
    </form>
    
    <div className={styles.haveAccount}>
        <a href="/login">Already have an Account?</a>
      </div>
    </div>
    </main>
  );
};

export default RegisterForm;
