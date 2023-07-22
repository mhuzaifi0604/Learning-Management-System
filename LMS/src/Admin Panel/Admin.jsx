import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import firebaseConfig from '../Configuration';
import PulseLoader from 'react-spinners/PulseLoader';
import { useNavigate } from 'react-router-dom';

initializeApp(firebaseConfig);

function Admin() {
    const [messages, setMessages] = useState([]);
    const [name, setname] = useState(localStorage.getItem('name'));
    const [loading, setloading] = useState(false);
    const [password, setpassword] = useState('');
    const [tasks, settasks] = useState([]);
    const [userStatus, setUserStatus] = useState({});
    const [getuid, setuid] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
    });
    const navigate= useNavigate();
    const handleChange = (e) => {
        if (e.target.name === 'password') {
          setpassword(e.target.value);
        } else {
          setFormData({ ...formData, [e.target.name]: e.target.value });
        }
      };
    const handleDelete = async(id) => {
        const db = getFirestore();
        try {
            setloading(true);
            await deleteDoc(doc(db, 'All-Users', id));
            console.log('Document with ID deleted: ', id);
            setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
          } catch (error) {
            console.error('Error deleting document from Firestore:', error);
          }finally{
            setloading(false);
          }
        //window.location.reload();
    }

    const changeDetails = (id) => {
        localStorage.setItem('message_id', id);
        navigate('/Admin_Dashboard/Change-Details')
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const db = getFirestore();
        const auth = getAuth();
    
        try {
          setloading(true);
          const auth = getAuth();
          const userCredential = await createUserWithEmailAndPassword(auth, formData.email, password);
          console.log('User signed Up with id: ', auth.currentUser.uid);
          const docRef = await addDoc(collection(db, 'All-Users'), {
            ...formData,
            password: password,
            tasks: tasks,
            UID: userCredential.user.uid,
          });
          console.log('Document written with ID: ', docRef.id);
          setFormData({
            name: '',
            email: '',
            role: '',
          });
          const querySnapshot = await getDocs(collection(db, 'All-Users'));
          const messagesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setMessages(messagesData);
          //window.location.reload();
          setuid(auth.currentUser.uid);
          console.log('uid in try: ', userCredential.user.uid)
        } catch (error) {
          console.error('Error storing data in Firestore:', error);
        } finally {
          setloading(false);
        }
      };
      useEffect(() => {
        const fetchMessages = async () => {
          try {
            setloading(true);
            const db = getFirestore();
            const querySnapshot = await getDocs(collection(db, 'All-Users'));
            const messagesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesData);
      
            // Fetch the user status for each UID
            const userStatusObj = {};
            messagesData.forEach((message) => {
              userStatusObj[message.UID] = !message.disabled;
            });
            setUserStatus(userStatusObj);
            console.log('UID: ', getuid);
          } catch (error) {
            console.error('Error fetching data from Firestore:', error);
          } finally {
            setloading(false);
          }
        };
        fetchMessages();
      }, [getuid]);

    //   const handleToggleUserStatus = async (uid) => {
    //     try {
    //       setloading(true);
    //       const auth = getAuth();
    //       const user = auth.currentUser;
    //       if (!user) {
    //         console.error('No authenticated user found.');
    //         return;
    //       }
    
    //       // Fetch the user from Firebase Authentication by UID
    //       const userRecord = getAdditionalUserInfo(auth, uid);
    
    //       // Toggle the disabled status of the user
    //       const updatedDisabledStatus = !userRecord.disabled;
    //       await updateProfile(user, { disabled: updatedDisabledStatus });
    
    //       // Fetch the updated user list from Firebase Authentication
    //       const updatedUserList = await auth.listUsers();
    //       const updatedUserStatus = {};
    //       updatedUserList.users.forEach((user) => {
    //         updatedUserStatus[user.uid] = !user.disabled;
    //       });
    //       setUserStatus(updatedUserStatus);
    //     } catch (error) {
    //       console.error('Error toggling user status in Firebase Authentication:', error);
    //     } finally {
    //       setloading(false);
    //     }
    //   };

    return (
        <div className="flex flex-col items-center h-screen w-screen border border-pink-500">
            <h1 className="text-2xl font-bold mb-4">Welcome {name}</h1>
            <div className='w-full mb-1'>
                <form onSubmit={handleSubmit} className='flex flex-row w-full gap-2'>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className='basis-1/3 h-8 text-black border border-pink-500 space-x-2 rounded-full p-1'
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className='basis-1/3 h-8 text-black border border-pink-500 space-x-2 rounded-full p-1'
                    />
                    <input
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="role"
                        className='basis-1/3 h-8 text-black border border-pink-500 space-x-2 rounded-full p-1'
                    />

                    <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="password"
                        className='basis-1/3 h-8 text-black border border-pink-500 space-x-2 rounded-full p-1'
                    />
                    <button type="submit" className='border border-teal-500 text-lg font-serif p-1'>Add</button>
                </form>
            </div>
            {loading ?
                <div className="flex justify-center items-center h-screen">
                    <PulseLoader color="teal" size={20} loading={loading} />
                </div>
                :
                <div className="grid grid-cols-3 gap-4 w-5/6">
                    {messages.map((message) => (
                        <div key={message.id} className="flex flex-col items-center border border-green-500 p-4 h-64 relative shadow-lg shadow-black rounded-md">
                            <div className='h-24 w-24 rounded-full text-center text-3xl font-extrabold font-serif flex justify-center items-center bg-black text-yellow-500'>
                                {message.name[0].toUpperCase()}
                            </div>

                            <p className="text-xl font-extrabold font-serif">{message.name}</p>
                            <p className="text-sm font-bold font-serif italic">{message.role}</p>
                            <p className="text-md font-serif text-justify">{message.email}</p>
                            <div className='flex w-full h-12 gap-1 justify-end absolute bottom-0 p-1'>
                            {/* <button
                  onClick={() => handleToggleUserStatus(message.UID)}
                  className={`w-10 text-xl shadow-md shadow-black rounded-md ${userStatus[message.UID] ? 'text-green-500' : 'text-red-500'}`}
                >
                  {userStatus[message.UID] ? '🔓' : '🔒'}
                </button> */}
                                <button 
                                onClick={() => {changeDetails(message.id)}}
                                className='w-10 text-xl shadow-md shadow-black rounded-md'
                                >
                                    &#x270F;
                                </button>
                                <button 
                                onClick={() => {handleDelete(message.id)}}
                                className='w-10 text-xl shadow-md shadow-black rounded-md'
                                >
                                    &#x1F5D1;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            }
            {userDetails}
        </div>
    );
}

export default Admin;

// Fetching Specific Data
{/*import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../Configuration'; // Adjust the path if necessary

initializeApp(firebaseConfig);

function Admin() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    // Function to fetch emails from Firestore
    const fetchEmails = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'All-Users'));
        
        // Extract emails from each document and store them in the 'emails' state
        const emailData = querySnapshot.docs.map((doc) => doc.data().email);
        setEmails(emailData);
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    // Call the fetchEmails function when the component mounts
    fetchEmails();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Emails from Firestore:</h1>
      <ul className="space-y-4">
        {emails.map((email, index) => (
          <li key={index}>
            <p>Email: {email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;*/}