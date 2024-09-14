"use client";
import React from 'react';
import { useState , useEffect } from 'react';
import styles from './page.module.css'
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import logout from '../../components/logoutFunction'


export default function UserProfile () {
    const router = useRouter();

        const [userData, setUserData] = useState<{ [key: string]: any }>({}); // State to store fetched user data
        const [documentData, setDocumentData] = useState<any[]>([]); // State to store fetched documents
        const [loading, setLoading] = useState<boolean>(false); // State to manage loading state for user data
        const [error, setError] = useState<string>(''); // State to handle user data errors
        const [loadingDocument, setLoadingDocument] = useState<boolean>(false); // State to manage loading state for documents
        const [errorDocument, setErrorDocument] = useState<string>(''); // State to handle document errors
        const [formattedBirthDate, setFormattedBirthDate] = useState<string>('');
        const [formattedCreatedAt, setFormattedCreatedAt] = useState<string>('');
    
        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');

        console.log(token)
        console.log(userId)

        useEffect(() => {
            const fetchUserData = async () => {
                if (!userId) {
                    setError('User ID is not available');
                    return;
                }
            
                setLoading(true);
            
                try {
                    console.log('Fetching user data...');
                    const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
            
                    if (response.status === 401) {
                        throw new Error('Unauthorized: Token may be invalid or expired');
                    }
            
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
            
                    const data = await response.json();
                    setUserData(data);
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError('An unknown error occurred');
                    }
                } finally {
                    setLoading(false);
                }
            };
            
            fetchUserData();
        }, [userId, token]); // Dependencies array
    

    
        useEffect(() => {
            if (!token) {
                console.error('Token is not available');
                return;
            }
        
            const fetchDocumentData = async () => {
                console.log('Token:', token);  
        
                try {
                    const response1 = await fetch(`http://localhost:8000/api/documents/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
        
                    if (!response1.ok) {
                        throw new Error(`Failed to fetch document data: ${response1.statusText}`);
                    }
        
                    const data = await response1.json();
                    setDocumentData(data);
                    console.log(documentData)
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        setErrorDocument(err.message);
                    } else {
                        setErrorDocument('An unknown error occurred');
                    }
                } finally {
                    setLoadingDocument(false);
                }
            };
        
            fetchDocumentData();
        }, [token]); 
    

        const handleRequestButton: React.MouseEventHandler<HTMLButtonElement> = (event) => {
            event.preventDefault();
           router.push(`/user/${userId}/request`)
          };
          useEffect(() => {
            const birthDate = new Date(userData.birth_date);
    
            if (isNaN(birthDate.getTime())) {
                console.error('Invalid Date:', userData.birth_date);
                setFormattedBirthDate('Invalid Date');
            } else {
                const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
                setFormattedBirthDate(birthDate.toLocaleDateString('en-US', options));
            }
        }, [userData.birth_date]);

    useEffect(() => {
        const createdAt = new Date(userData.birth_date);

        if (isNaN(createdAt.getTime())) {
            console.error('Invalid Date:', userData.birth_date);
            setFormattedCreatedAt('Invalid Date');
        } else {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            setFormattedCreatedAt(createdAt.toLocaleDateString('en-US'));
        }
    }, [userData.createdAt]);
   
         
    function calculateAge(birthDateString: string): number | string {
        // Check if birthDateString is provided
        if (!birthDateString) {
            return 'Birth date string is missing';
        }
    
        // Create a Date object from the birthDateString
        const birthDate = new Date(birthDateString);
    
        // Check if the birthDate is valid
        if (isNaN(birthDate.getTime())) {
            return 'Invalid Date';
        }
    
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
    
        // Adjust age if the current month is before the birth month or if it's the birth month but the current day is before the birth day
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    
        return age;
    }

    //for log out function 
    const logoutBtn = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userId')

        router.push('/login')
    }

    function formatDateString(dateString: string): string {
        const date = new Date(dateString);
    
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date string');
        }
    
        return format(date, 'MM/dd/yy');
    }
    



    const age = calculateAge(userData.birth_date)
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (errorDocument) return <p>Error: {errorDocument}</p>;

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
    <td>1. Certified copy of TOR and Diploma/Certificate or
    2. Certified copy of TOR and Certification of earned units</td>
    <td>50.00 </td>
  </tr>
  <tr>
    <td>Certification</td>
    <td>3 working days</td>
    <td>1. Clearance if first request</td>
    <td>50.00</td>
  </tr>
  <tr>
    <td>Certified Copy</td>
    <td>3 working days</td>
    <td>1. Original and photocopy of the documents</td>
    <td>50.00/document</td>
  </tr>
  <tr>
    <td>Diploma/Certificate</td>
    <td>7 working days</td>
    <td>1. Clearance if first request</td>
    <td>Undergraduate programs= 200(+50 for succeeding issuance) Graduate programs= 300(+50 for succeeding issuance)</td>
  </tr>
  <tr>
    <td>Transcript of Records</td>
    <td>7 working days</td>
    <td>1. Clearance if first request and if for transfer purposes
    2. 2X2 picture with white background or in academic gown</td>
    <td>50.00/page-local purposes 75.00/page-international purposes</td>
  </tr>
  <tr>
    <td>Evaluation of Grades</td>
    <td>3 working days</td>
    <td> Certificate of Enrollment</td>
    <td>80.00</td>
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