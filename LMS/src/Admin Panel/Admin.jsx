import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from '../Configuration';
import PulseLoader from 'react-spinners/PulseLoader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

initializeApp(firebaseConfig);

function Admin() {
  const [messages, setMessages] = useState([]);
  const [name, setname] = useState(localStorage.getItem('name'));
  const [loading, setloading] = useState(false);
  const [enabled, setenabled] = useState(true);
  const [password, setpassword] = useState('');
  const [notifications, setnotifications] = useState([]);
  const [tasks, settasks] = useState([
    {
      task: 'New Task', priority: 'Low'
    }
  ]);
  const [userStatus, setUserStatus] = useState({});
  const [getuid, setuid] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'password') {
      setpassword(e.target.value);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleDelete = async (id) => {
    const db = getFirestore();
    try {
      setloading(true);
      await deleteDoc(doc(db, 'All-Users', id));
      //console.log('Document with ID deleted: ', id);
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
    } catch (error) {
      console.error('Error deleting document from Firestore:', error);
    } finally {
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
      const userdata ={
        email: formData.email,
        status: 'enabled',
        password: password,
        tasks: [{task: 'Hello', priority: 'low'}],
        notifications: [{role: 'admin', note: 'User Created'}],
      }
      setloading(true);
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, password);
      //console.log('User signed Up with id: ', auth.currentUser.uid);
      const docRef = await addDoc(collection(db, 'All-Users'), {
        ...formData,
        password: password,
        tasks: tasks,
        UID: userCredential.user.uid,
        notifications: notifications,
      });
      await axios.post('http://localhost:6969/add-user', {
        data:userdata,
      })
      //console.log('Document written with ID: ', docRef.id);
      setFormData({
        name: '',
        email: '',
        role: '',
      });
      setpassword('');
      const querySnapshot = await getDocs(collection(db, 'All-Users'));
      const messagesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesData);
      setuid(auth.currentUser.uid);
      //console.log('uid in try: ', userCredential.user.uid)
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
        //console.log('UID: ', getuid);
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      } finally {
        setloading(false);
      }
    };
    fetchMessages();
  }, [getuid]);

  const handleToggleUserStatus = async (mail) => {
    try {
      const response = await axios.get(`http://localhost:6969/data?email=${mail}`);
      const updatedData = { email: mail, status: '' };
      if (response.data.status === 'enabled') {
        setenabled(false);
        updatedData.status = 'disabled';
      } else if (response.data.status === 'disabled') {
        setenabled(true);
        updatedData.status = 'enabled';
      }
      try {
        await axios.put(`http://localhost:6969/update`, updatedData);
        console.log('Status Updated Successfully!');
      } catch (error) {
        console.error('No user found!', error);
      }
    } catch (error) {
      console.error('Could not find user in data: ', error);
    }

  };

  return (
    <div className="flex flex-col items-center h-screen w-screen bg-[#3e5e51]">
      <h1 className="font-bold mb-4 text-white font-serif text-3xl">Welcome {name[0].toUpperCase()}{name.slice(1, name.length)}</h1>
      <div className='w-full mb-4'>
        <form onSubmit={handleSubmit} className='flex flex-row w-full gap-2 justify-center items-center'>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className='basis-1/5 h-8 text-black border-2 border-black space-x-2 rounded-md p-1 placeholder-gray-400 font-bold italic font-serif'
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className='basis-1/5 h-8 text-black border-2 border-black space-x-2 rounded-md p-1 placeholder-gray-400 font-bold italic font-serif'
          />
          <input
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="role"
            className='basis-1/5 h-8 text-black border-2 border-black space-x-2 rounded-md p-1 placeholder-gray-400 font-bold italic font-serif'
          />

          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="password"
            className='basis-1/5 h-8 text-black border-2 border-black space-x-2 rounded-md p-1 placeholder-gray-400 font-bold italic font-serif'
          />
          <button type="submit" className='bg-black text-lg font-serif p-1 text-white rounded-md w-12'>Add</button>
        </form>
      </div>
      {loading ?
        <div className="flex justify-center items-center h-screen">
          <PulseLoader color="teal" size={20} loading={loading} />
        </div>
        :
        <div className="grid grid-cols-3 gap-4 w-5/6">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col items-center border-2 border-black p-4 h-64 relative shadow-lg shadow-black rounded-md bg-gray-200">
              <div className='h-24 w-24 rounded-full text-center text-3xl font-extrabold font-serif flex justify-center items-center bg-black text-yellow-500'>
                {message.name[0].toUpperCase()}
              </div>

              <p className="text-xl font-extrabold font-serif">{message.name}</p>
              <p className="text-sm font-bold font-serif italic">{message.role}</p>
              <p className="text-md font-serif text-justify">{message.email}</p>
              <div className='flex w-full h-12 gap-1 justify-end absolute bottom-0 p-1'>
                <button
                  onClick={() => handleToggleUserStatus(message.email)}
                  className={`w-10 text-xl shadow-md shadow-black rounded-md ${enabled ? 'bg-green-600' : 'bg-red-600'}`}
                >
                  {enabled ? '🔓' : '🔒'}
                </button>
                <button
                  onClick={() => { changeDetails(message.id) }}
                  className='w-10 text-xl shadow-md shadow-black rounded-md'
                >
                  &#x270F;
                </button>
                <button
                  onClick={() => { handleDelete(message.id) }}
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