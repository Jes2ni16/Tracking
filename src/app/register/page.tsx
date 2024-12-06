"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './page.module.css'

const RegisterForm: React.FC = () => {
  const router = useRouter(); // Initialize router for navigation

  // State to hold form data
  const [studentId, setStudentId] = useState<string>(''); // State for student ID
  const [firstName, setFirstName] = useState<string>(''); // State for first name
  const [middleName, setMiddleName] = useState<string>(''); // State for middle name
  const [lastName, setLastName] = useState<string>(''); // State for last name
  const [dob, setDob] = useState<string>(''); // State for date of birth
  const [birthPlace, setBirthPlace] = useState<string>(''); // State for birth place
  const [sex, setSex] = useState<string>(''); // State for gender
  const [civil, setCivil] = useState<string>(''); // State for civil status
  const [citizenship, setCitizenship] = useState<string>(''); // State for citizenship
  const [religion, setReligion] = useState<string>(''); // State for religion
  const [address, setAddress] = useState<string>(''); // State for address
  const [email, setEmail] = useState<string>(''); // State for email
  const [password, setPassword] = useState<string>(''); // State for password

  const [contact, setContact] = useState<string>(''); // State for contact number
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false); // State for terms agreement
  
  // State to handle loading and errors
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // Prevent form submission from reloading the page

    // Basic validation
    if (!email || !password ) {
      setError('All fields are required.'); // Set error if required fields are empty
      return; // Exit function if validation fails
    }
      
    if (!agreeTerms) {
        setError('You must agree to the terms and conditions.'); // Set error if terms are not agreed
        return; // Exit function if validation fails
      }

      setLoading(true); // Set loading state to true
      setError(null); // Clear any existing errors

 try {
  const res = await fetch('https://tracking-server-9kmt.onrender.com/api/users/register', {
    method: 'POST', // Set HTTP method to POST
    headers: {
      'Content-Type': 'application/json', // Specify JSON content type
    },
    body: JSON.stringify({ // Prepare body data
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

  // Check if response is not OK
  if (!res.ok) {
    const errorData = await res.json(); // Parse error data
    setError(errorData.error || 'Registration failed.'); // Set error message
    return; // Exit function if registration fails
  }

  const data = await res.json(); // Parse successful response

    router.push(`/login`); // Redirect to login page after successful registration
  
  // Clear form fields
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
  console.error('An error occurred:', err); // Log any error that occurs
  setError('An error occurred during registration.'); // Set error message for general errors
} finally {
  setLoading(false); // Reset loading state
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
          <option value="Male">Male</option>
          <option value="Female">Female</option>
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
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Separated">Separated</option>
          <option value="Annulled">Annulled</option>
          <option value="Widow">Widow</option>
          <option value="Divorced">Divorced</option>
          </select>
      </div>

      <div className={styles.inputBox}>
        <label htmlFor="citizenship">Citizenship: </label>
        <select
          id="citizenship"
          value={citizenship}
          onChange={(e) => setCitizenship(e.target.value)}
          required
        >
<option value="" disabled>-- SELECT --</option>
<option value="Filipino">Filipino</option>
<option value="American">American</option>
        </select>
      </div>
      
      <div className={styles.inputBox}>
        <label htmlFor="religion">religion: </label>
        <select
          id="religion"
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
          required
        >
<option value="" disabled>-- SELECT --</option>
<option value="Catholic">Catholic</option>
<option value="Islam">Islam</option>
<option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
<option value="Seventh-day Adventist">Seventh-day Adventist</option>
<option value="The Church of Jesus Christ of Latter-day Saints">The Church of Jesus Christ of Latter-day Saints</option>

        </select>
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
