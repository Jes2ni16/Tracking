"use client"; // Enables client-side rendering for this component in Next.js
import React from 'react'; // Import React
import { useState , useEffect } from 'react'; // Import useState and useEffect hooks for state and lifecycle management
import styles from './page.module.css'; // Import CSS module for styling
import { useRouter } from 'next/navigation'; // Import useRouter for programmatic navigation in Next.js
import { format } from 'date-fns'; // Import the date-fns library for formatting dates
import logout from '../../components/logoutFunction'; // Import a logout function

// Component definition for UserProfile
export default function UserProfile () {
    const router = useRouter(); // Get the router object for navigation

    // State to store fetched user data
    const [userData, setUserData] = useState<{ [key: string]: any }>({}); 
    // State to store fetched documents
    const [documentData, setDocumentData] = useState<any[]>([]); 
    // State to manage loading state for user data
    const [loading, setLoading] = useState<boolean>(false); 
    // State to handle user data errors
    const [error, setError] = useState<string>(''); 
    // State to manage loading state for documents
    const [loadingDocument, setLoadingDocument] = useState<boolean>(false); 
    // State to handle document errors
    const [errorDocument, setErrorDocument] = useState<string>(''); 
    // State to store formatted birth date
    const [formattedBirthDate, setFormattedBirthDate] = useState<string>(''); 
    // State to store formatted created date
    const [formattedCreatedAt, setFormattedCreatedAt] = useState<string>(''); 

    // Get the token and user ID from localStorage
    const token = localStorage.getItem('accessToken'); 
    const userId = localStorage.getItem('userId'); 

    // Fetch user data when component mounts or when token/userId changes
    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) { // Check if userId is available
                setError('User ID is not available');
                return;
            }
        
            setLoading(true); // Set loading to true while fetching user data
        
            try {
                // Fetch user data from the API
                const response = await fetch(`https://tracking-server-9kmt.onrender.com/api/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                    }
                });
        
                if (response.status === 401) {
                    throw new Error('Unauthorized: Token may be invalid or expired'); // Handle unauthorized status
                }
        
                if (!response.ok) {
                    throw new Error('Failed to fetch user data'); // Handle failed requests
                }
        
                const data = await response.json(); // Parse the response JSON
                setUserData(data); // Set the user data state
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message); // Set error message if there is an error
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false); // Set loading to false once the request is complete
            }
        };
        
        fetchUserData(); // Call the fetchUserData function
    }, [userId, token]); // Dependencies array for when userId or token changes

    // Fetch document data
    useEffect(() => {
        if (!token) { // If no token, do not proceed
            return;
        }
    
        const fetchDocumentData = async () => {
    
            try {
                // Fetch documents data from the API
                const response1 = await fetch(`https://tracking-server-9kmt.onrender.com/api/documents/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Include token in the request
                    }
                });
    
                if (!response1.ok) {
                    throw new Error(`Failed to fetch document data: ${response1.statusText}`); // Handle failed requests
                }
    
                const data = await response1.json(); // Parse the response JSON
                // Sort the data by creation date in descending order
                const sortedData = data.sort((a:any, b:any) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateB - dateA; // Sort newest first
                  });
                setDocumentData(sortedData); // Set the sorted document data
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setErrorDocument(err.message); // Set error message if there is an error
                } else {
                    setErrorDocument('An unknown error occurred');
                }
            } finally {
                setLoadingDocument(false); // Set loading to false once the request is complete
            }
        };
    
        fetchDocumentData(); // Call the fetchDocumentData function
    }, [token]); // Dependencies array for when token changes

    // Handle button click to request a document
    const handleRequestButton: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
       router.push(`/user/${userId}/request`); // Navigate to the request page
    };

    // Format birth date
    useEffect(() => {
        const birthDate = new Date(userData.birth_date);

        if (isNaN(birthDate.getTime())) {
            setFormattedBirthDate('Invalid Date'); // Handle invalid dates
        } else {
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
            setFormattedBirthDate(birthDate.toLocaleDateString('en-US', options)); // Format the date
        }
    }, [userData.birth_date]); // Dependencies array for when birth_date changes

    // Format created date
    useEffect(() => {
        const createdAt = new Date(userData.birth_date);

        if (isNaN(createdAt.getTime())) {
            setFormattedCreatedAt('Invalid Date'); // Handle invalid dates
        } else {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            setFormattedCreatedAt(createdAt.toLocaleDateString('en-US')); // Format the date
        }
    }, [userData.createdAt]); // Dependencies array for when createdAt changes

    // Function to calculate user's age based on birth date
    function calculateAge(birthDateString: string): number | string {
        if (!birthDateString) {
            return 'Birth date string is missing'; // Return message if birth date is missing
        }
    
        const birthDate = new Date(birthDateString); // Create a Date object from the birth date
    
        if (isNaN(birthDate.getTime())) {
            return 'Invalid Date'; // Handle invalid dates
        }
    
        const today = new Date(); // Get today's date
        let age = today.getFullYear() - birthDate.getFullYear(); // Calculate the age
        const monthDifference = today.getMonth() - birthDate.getMonth();
    
        // Adjust age if the current month/day is before the birth month/day
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    
        return age; // Return the calculated age
    }

    // Function to handle user logout
    const logoutBtn = () => {
        localStorage.removeItem('accessToken'); // Remove the token from localStorage
        localStorage.removeItem('userId'); // Remove the userId from localStorage
        router.push('/login'); // Navigate to the login page
    }

    // Function to format a date string using date-fns
    function formatDateString(dateString: string): string {
        const date = new Date(dateString);
    
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date string'); // Handle invalid date strings
        }
    
        return format(date, 'MM/dd/yy'); // Format the date using date-fns
    }

    const age = calculateAge(userData.birth_date); // Calculate the user's age
    if (loading) return <p>Loading...</p>; // Display loading message while fetching data
    if (error) return <p>Error: {error}</p>; // Display error message if there is an error fetching user data
    if (errorDocument) return <p>Error: {errorDocument}</p>; // Display error message if there is an error fetching documents

    return(
    
    <main className={styles.main}>

        <div className={styles.wrapper}>
            <div className={styles.logout} onClick={logout}>
                <p> &larr; Log-out</p></div>
        <div className={styles.profileInfo}>
    <div className={styles.profileName}>
        <h2>
            {userData.first_name} &nbsp; {userData.middle_name}  &nbsp;  {userData.last_name}
        </h2>
    </div>
    <div className={styles.profileDetails}>
      <ul>
        <li><p>ID Number:</p> <p>{userData.student_id}</p></li>
        <li><p>Email:</p> <p>{userData.email}</p></li>
        <li><p>Contact Number:</p> <p>{userData.contact}</p></li>
        <li><p>Gender:</p> <p>{userData.sex}</p></li>
        <li><p>Civil Status:</p> <p>{userData.civil_status}</p></li>
        <li><p>Citizenship:</p> <p>{userData.citizenship}</p></li>
        <li><p>Religion:</p> <p>{userData.religion}</p></li>
        <li><p>Birth Date:</p> <p>{formattedBirthDate}</p></li>
        <li><p>Age:</p> <p>{age}</p></li>
        <li><p>Date Created:</p> <p>{formattedCreatedAt}</p></li>
      </ul>
    </div>
        </div>


        <div className={styles.documentArea}>

            <div className={styles.docReq}>
            <table>
  <tr>
    <th>DOCUMENTS</th>
    <th>LEAD TIMES</th>
    <th>REQUIREMENTS</th>
    <th>FEES</th>
  </tr>
  <tr>
    <td>CAV</td>
    <td>7 working days</td>
    <td>PSA Original,<br />
Certificate of Enrollment, <br />
Documentary Stamp
</td>
    <td>100.00 </td>
  </tr>
  <tr>
    <td>Certification (any kind)</td>
    <td>3 working days</td>
    <td>PSA Original, <br />
Documentary Stamp
</td>
    <td>100.00</td>
  </tr>

  <tr>
    <td>Any Certified Copies</td>
    <td>3 working days</td>
    <td>1PSA Original, <br />
Documentary Stamp
</td>
    <td>100.00</td>
  </tr>
  <tr>
    <td>Diploma</td>
    <td>7 working days</td>
    <td>PSA Original, <br />
Documentary Stamp, <br />
Transcript of Records
</td>
    <td>265.00</td>
  </tr>
  <tr>
    <td>Transcript of Records (TOR)</td>
    <td>7 working days</td>
    <td> Form 137A
PSA Original,
Documentary Stamp, <br />
2v2 picture (with nametag and white background)
</td>
    <td>100.00</td>
  </tr>
  <tr>
    <td>Evaluation of Grades</td>
    <td>3 working days</td>
    <td>PSA Original, <br />
Documentary Stamp
</td>
    <td>200</td>
  </tr>
</table>
            </div>

       <button className={styles.requestButton} onClick={handleRequestButton}>
        Request a document now
       </button>

            <div className={styles.requestedStatus}>
<h3>Status of Requested document</h3>
<div className={styles.requestedDoc}>
<table>
        <thead>
            <tr>
                <th>Req. Date</th>
                <th>Tracking #</th>
                <th>Req. Document</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
        {documentData.map((data) => (
                    <tr key={data.id}> 
                <td>{formatDateString(data.createdAt)}</td>
                <td>{data.trackingNumber}</td>
                <td>{data.filename}</td>
                <td>{data.status}</td>
            </tr>     
                ))}
        </tbody>

    </table>
</div>
            </div>


        </div>
        </div>
    </main>)

}