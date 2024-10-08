// Import necessary hooks and components from React and Next.js
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter , usePathname } from 'next/navigation';
import styles from './page.module.css'

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  // State variables to handle file inputs for the form
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [file3, setFile3] = useState<File | null>(null);

  // State variables to store form input data
  const [filename, setFilename] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [lastAttended, setLastAttended] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [major, setMajor] = useState<string>('');
  const [copies, setCopies] = useState<string>('1');
  const [token, setToken] = useState<string | null>(null);

  // State to handle form submission response message and errors
  const [message, setMessage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Effect hook to fetch token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    setToken(storedToken);
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // Prevent default form submission behavior

    setLoading(true); // Set loading state
    setError(null); // Reset error state

    // Initialize FormData and append selected files
    const formData = new FormData();
    if (file1) formData.append('files', file1);
    if (file2) formData.append('files', file2);
    if (file3) formData.append('files', file3);

    // Append other form data fields to the FormData object
    formData.append('filename', filename);
    formData.append('purpose', purpose);
    formData.append('schoolName', schoolName);
    formData.append('lastAttended', lastAttended);
    formData.append('course', course);
    formData.append('major', major);
    formData.append('copies', copies);

    // Try block to make API request for form submission
    try {
      const res = await fetch('https://tracking-server-9kmt.onrender.com/api/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // Include token in request header for authorization
        },
        body: formData, // Attach form data in request body
      });

      // Handle response error if request is not successful
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || 'Registration failed.');
        return;
      }

      // If successful, reset form fields and set success message
      const data = await res.json();
      setFilename('');
      setPurpose('');
      setSchoolName('');
      setLastAttended('');
      setCourse('');
      setMajor('');
      setCopies('');
      setFile1(null);
      setFile2(null);
      setFile3(null);
      setMessage(true); // Show success message

      // Redirect user after a short delay
      setTimeout(() => {
        const parts = pathname.split('/').filter(part => part); // Split current URL path and remove empty parts
        if (parts.length > 1) {
          const newPath = `/${parts.slice(0, -1).join('/')}`; // Create new path by removing the last segment
          router.push(newPath); // Redirect to the new path
        } else {
          router.push('/'); // Fallback to the root path
        }
      }, 2000); // Redirect after 2 seconds

    } catch (err) {
      setError('An error occurred during registration.'); // Handle errors
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  
  return (
    <main>
      {!message ? 
      <div className={styles.box}>
        <h1>Request Document Form </h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.userDetails}>
            <div className={styles.inputBox}>
              <label htmlFor="filename">Request document for: </label>
              <select
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                required
              >
                <option value="" disabled>-- SELECT --</option>
                <option value="cav">CAV</option>
                <option value="diploma">Diploma</option>
                <option value="Certified Copy">Certified Copy</option>
                <option value="Earned Units/CAR [Certification /Letter]">Earned Units/CAR [Certification /Letter]</option>
                <option value="Enrollment [Certification /Letter]">Enrollment [Certification /Letter]</option>
                <option value="Grade(s) of Cross Enrollee [Certification /Letter]">Grade(s) of Cross Enrollee [Certification /Letter]</option>
                <option value="dGraduation [Certification /Letter]">Graduation [Certification /Letter]</option>
                <option value="GWA [Certification /Letter]">GWA [Certification /Letter]</option>
                <option value="English Language as Medium of Instruction [Certification /Letter]">English Language as Medium of Instruction [Certification /Letter]</option>
                <option value="No Objection [Certification /Letter]">No Objection [Certification /Letter]</option>
                <option value="S.O Exemption [Certification /Letter]">S.O Exemption [Certification /Letter]</option>
                <option value="S.P. to Cross Enroll [Certification /Letter]">S.P. to Cross Enroll [Certification /Letter]</option>
                <option value="2nd Request of GTC [Certification /Letter]">2nd Request of GTC [Certification /Letter]</option>
                <option value="Certificate of Enrollment">Certificate of Enrollment</option>
                
              </select>
            </div>

            <div className={styles.inputBox}>
              <label htmlFor="purpose">Purpose:</label>
              <textarea
                id="purpose"
             
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputBox}>
              <label htmlFor="schoolName">Name of School in College:</label>
              <input
                id="schoolName"
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputBox}>
              <label htmlFor="lastAttended">Last Attended Date:</label>
              <input
                id="lastAttended"
                type="date"
                value={lastAttended}
                onChange={(e) => setLastAttended(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputBox}>
              <label htmlFor="course">Course:</label>
              <input
                id="course"
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputBox}>
              <label htmlFor="major">Major <span>(optional)</span>:</label>
              <input
                id="major"
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputBox}>
              <label htmlFor="copies">Number of Copies:</label>
              <input
                id="copies"
                type="text"
                value={copies}
                onChange={(e) => setCopies(e.target.value)}
                required
              />
            </div>

            <div className={styles.reqFiles}>
          <label>Requirements: <span>(should not be greater than 10mb)</span></label>
          <div>
          <input
        type="file"
        onChange={(e) => e.target.files && setFile1(e.target.files[0])}
      />
      <input
        type="file"
        onChange={(e) => e.target.files && setFile2(e.target.files[0])}
      />
      <input
        type="file"
        onChange={(e) => e.target.files && setFile3(e.target.files[0])}
      />
        </div>
        </div>

            <button type="submit" disabled={loading} className={styles.requestBtn}>
              {loading ? 'Requesting...' : 'Request Now'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </form>
        
      </div> : <div className={styles.message}><p>Requested Successfully......</p></div>}
    </main>
  );
};

export default RegisterForm;
