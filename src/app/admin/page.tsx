"use client";
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { format } from 'date-fns';
import logout from '../components/logoutFunction'

// Define the Document interface
interface Document {
    _id: string; // or string, depending on your use case
    trackingNumber: string;
    createdAt: string;
    filename: string;
    status: string;
    createdBy: string;
}

interface User {
    _id: string; // or string, depending on your use case
    first_name: string;
    createdAt: string;
    email: string;
    status: string;
    createdBy: string;
    last_name: string; 
}

// AdminPage Component
const AdminPage: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]); 
    const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]); 
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); 
    const [home, setHome] = useState<boolean>(false); 
    const [users, setUsers] = useState<User[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(' ');

    
    useEffect(() => {
        // Get token from localStorage
        const storedToken = localStorage.getItem('accessToken');
        setToken(storedToken);
      }, []);


    useEffect(() => {
        if(!token) return;


        const fetchDocuments = async () => {
            try {
                
        const res = await fetch('http://localhost:8000/api/documents', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
            },
    
          });     
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: Document[] = await res.json(); // Type the fetched data
                setDocuments(data);
               
                    setFilteredDocuments(data.filter(doc => doc.status !== 'archived'));
                
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [token]);




    useEffect(() => {
        if(!token) return;
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: User[] = await res.json(); // Type the fetched data
                setUsers(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]); 

    const getButtonText = (status:string) => {
        switch (status) {
            case 'Draft':
                return 'Accept';
            case 'viewed':
                return 'Process';
            case 'process':
                return 'Release';
            case 'releasing':
                return 'Released';
            case 'released':
                return 'Archived';
            default:
                return ;
        }
    };


    const getFilteredDocuments = (status1?: string, status2?: string) => {
        setHome(true)
        let filtered = documents;
if (status2){
    setSelectedFilter(status2);
}

if (status1 === '') {
    setFilteredDocuments(documents.filter(doc => doc.status !== 'archived'));
  } else {
    setFilteredDocuments(documents.filter(doc => doc.status === status1));
  }
       
    }

    const getUserNameById = (userId: string) => {
        const user = users.find(user => user._id === userId);
        return user ?  `${user.first_name} ${user.last_name}` : 'Unknown User';
    };

const formatDate = (createdAt : string) => {

const date = new Date(createdAt);

const formattedDate = format(date, 'MMMM dd, yyyy '); // Adjust format as needed
return formattedDate;
}

    console.log(users)
    console.log(documents)
    // Display loading and error messages
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

console.log(filteredDocuments)

const handleStatusChange = async (documentId: string, currentStatus: string) => {
    const isConfirmed = window.confirm('Are you sure you want to update the document status?');
    
    if (!isConfirmed) return;
  
    setLoading(true);
    setError(null);
  
    let newStatus: string | null = null;
  
    switch (currentStatus) {
      case 'Draft':
        newStatus = 'viewed';
        break;
      case 'viewed':
        newStatus = 'process';
        break;
      case 'process':
        newStatus = 'releasing';
        break;
      case 'releasing':
        newStatus = 'released'
      default:
        setLoading(false);
        setError('Invalid current status');
        return;
    }
  
    try {
      const res = await fetch(`http://localhost:8000/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!res.ok) {
        throw new Error('Failed to update status');
      }
  
      // Update the local state to reflect the new status
      setDocuments(prevDocuments =>
        prevDocuments.map(doc =>
          doc._id === documentId ? { ...doc, status: newStatus } : doc
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
    return (
        <main className={styles.wrapper}>
            <div className={styles.navigation}>
                <div className={styles.profile}>
                    <span className={styles.profilePic}></span>
                    <h3 className={styles.profileName}>Jestoni D. Brion</h3>
                </div>
                <hr />
                <div className={styles.navPanel}>
                    <p
                       className={selectedFilter === 'home' ? styles.selected : ''}
                    onClick={()=>getFilteredDocuments('','home')}>Home</p>
                    <p 
                     className={selectedFilter === 'draft' ? styles.selected : ''}
                    onClick={()=>getFilteredDocuments('Draft','draft')}>Draft</p>
                    <p
                        className={selectedFilter === 'viewed' ? styles.selected : ''}
                    onClick={()=>getFilteredDocuments('viewed','viewed')}>Viewed</p>
                    <p 
                        className={selectedFilter === 'process' ? styles.selected : ''}
                    onClick={()=>getFilteredDocuments('process','process')}>Processing</p>
                    <p 
                     className={selectedFilter === 'releasing' ? styles.selected : ''}
                    onClick={()=>getFilteredDocuments('releasing','releasing')}>For Release</p>
                    <p
                     className={selectedFilter === 'released' ? styles.selected : ''}
                    onClick={()=>getFilteredDocuments('released','released')}>Released</p>

                    <p onClick={logout}>Logout</p>
                </div>
            </div>
            <div className={styles.dataInformation}>
                <div className={styles.heading}>
                    <h1>Admin/Records Office</h1> <span> | Accepted document for appropriate action</span>
                </div>
                <div className={styles.dataResult}>
                    <h2>Document Pending for Action</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Tracking #</th>
                                <th>Date Requested</th>
                                <th>Document Type</th>
                                <th>From</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                        {
    filteredDocuments.map((data) => (
        <tr key={data._id}>
            <td>{data.trackingNumber}</td>
            <td>{formatDate(data.createdAt)}</td>
            <td>{data.filename}</td>
            <td>{getUserNameById(data.createdBy)}</td>
            <td>{data.status}</td>
            <td>
                <button
                    className={styles.acceptBtn}
                    onClick={() => handleStatusChange(data._id, data.status)}
                    disabled={loading}
                >
                    {loading
                                    ? 'Processing...'
                                    : getButtonText(data.status)}
                </button>
                <button className={styles.deleteBtn}>Delete</button>
            </td>
            <td>
                <a href={`/admin/document/${data._id}`} target="_blank" rel="noopener noreferrer">
                    View Details
                </a>
            </td>
        </tr>
    ))
 
}



                        
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default AdminPage;
