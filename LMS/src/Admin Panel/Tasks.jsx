import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc, collection, arrayUnion, getDocs, query, where } from 'firebase/firestore';
import PulseLoader from 'react-spinners/PulseLoader';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../Configuration';
initializeApp(firebaseConfig);

function Tasks() {
    const [loading, setloading] = useState(true);
    const [docdata, setdocdata] = useState(null);
    const [notifications, setnotifications] = useState([]);
    const [getnote, setnote] = useState('');
    const id = localStorage.getItem('message_id');
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState('');

    useEffect(() => {
        const fetchMessageDetails = async () => {
            try {
                setloading(true);
                const db = getFirestore();
                const messageRef = doc(db, 'All-Users', id);
                const messageSnapshot = await getDoc(messageRef);
                if (messageSnapshot.exists()) {
                    setdocdata(messageSnapshot.data());
                } else {
                    console.log('No Such document!');
                }
            } catch (error) {
                console.error('error Fetching document details', error);
            } finally {
                setloading(false);
            }
        };

        fetchMessageDetails();

    }, [id]);

    const addtasks = async (e) => {
        e.preventDefault();
        const db = getFirestore();
        try {
            setloading(true);
            const collectionRef = collection(db, 'All-Users');
            const newTask = { task, priority };
            await updateDoc(doc(collectionRef, id), {
                tasks: arrayUnion(newTask),
            });
            window.location.reload();
            console.log('Task added successfully!');
            setTask('');
            setPriority('');
        } catch (error) {
            console.error('Error adding task:', error);
        } finally {
            setloading(false);
        }
    };
    const addnotification = async (e) => {
        e.preventDefault();
        const db = getFirestore();
        try {
            setloading(true);
            const collectionRef = collection(db, 'All-Users');
            const newnote = getnote;
            await updateDoc(doc(collectionRef, id), {
                notifications: arrayUnion(newnote),
            });
            window.location.reload();
        } catch (error) {
            console.error('error adding note', error);
        } finally {
            setloading(false);
        }
    }

    const handleDelete = async (index) => {
        try {
            if (docdata && docdata.tasks && docdata.tasks.length > 0) {
                const tasksArray = [...docdata.tasks];
                tasksArray.splice(index, 1); // Remove the task at the specified index
                const db = getFirestore();
                const messageRef = doc(db, 'All-Users', id);
                await updateDoc(messageRef, { tasks: tasksArray });
                setdocdata({ ...docdata, tasks: tasksArray });
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };
    const DeleteNotification = async (index) => {
        try {
            if (docdata && docdata.notifications.length > 0) {
                setloading(true);
                const notes = [...docdata.notifications];
                notes.splice(index, 1);
                const db = getFirestore();
                const messageRef = doc(db, 'All-Users', id);
                await updateDoc(messageRef, { notifications: notes });
                setnotifications(notes);
                window.location.reload();
            }
        } catch (error) {
            console.error('error deleting notification: ', error);
        } finally {
            setloading(false);
        }
    }

    return (
        <>
            <div className='flex flex-col items-center h-screen w-screen text-black'>
                <h1 className='text-center'>Add or Delete Tasks</h1>
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <PulseLoader color="teal" size={20} loading={loading} />
                    </div>
                ) : (
                    docdata ? (
                        <div className="flex flex-col justify-center items-center w-screen">
                            <form onSubmit={addtasks} className="flex flex-row m-5 mt-0 p-4 w-4/5 border-2 border-blue-900 bg-[#170c27] backdrop-filter backdrop-blur-md shadow-lg shadow-teal-100 rounded-md">
                                <input
                                    type="text"
                                    id="task"
                                    value={task}
                                    onChange={(e) => setTask(e.target.value)}
                                    placeholder="Enter Task"
                                    className="border mt-2 mr-0 border-blue-500 p-2 w-2/5 rounded-md focus:outline-none focus:border-teal-500 bg-transparent text-white h-10"
                                />
                                <input
                                    type="text"
                                    id="priority"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    placeholder="Priority"
                                    className="border mt-2 border-blue-500 p-2 w-2/5 rounded-md focus:outline-none focus:border-teal-500 bg-transparent text-white h-10 ml-10"
                                />
                                <button className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md transition duration-300 mt-2 h-10 w-24 ml-10">
                                    Add Task
                                </button>
                            </form>
                            <table className="flex flex-col w-4/5 items-center">
                                <thead className='w-full'>
                                    <tr className='flex w-full'>
                                        <th className="border-2 w-1/6">Sr #</th>
                                        <th className="border-2 w-4/6">Task</th>
                                        <th className="border-2 w-1/6">Priority</th>
                                    </tr>
                                </thead>
                                <tbody className='flex flex-col w-full'>
                                    {docdata.tasks.map((task, index) => (
                                        <tr key={index} className='flex w-full text-center font-sans italic'>
                                            <td className="border-2 w-1/6">{index + 1}</td>
                                            <td className="border-2 w-4/6">{task.task}</td>
                                            <td className="border-2 w-1/6 font-semibold">{task.priority}
                                                <button onClick={() => handleDelete(index)} className='ml-4 text-md italic'>
                                                    &#x1F5D1;
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                            {loading ? (
                                <div className="flex justify-center items-center h-screen">
                                    <PulseLoader color="teal" size={20} loading={loading} />
                                </div>
                            ) : (
                                <div className='flex flex-col w-full'>
                                    <h2 className='text-black font-extrabold text-2xl italic font-serif underline mb-4 text-center'>Notifications</h2>
                                    <ul className='flex flex-col'>
                                        {docdata.notifications.map((note, index) => (
                                            <li key={index} className='ml-2 p-2 bg-teal-500 text-black rounded-full mb-4 border-2 border-black w-max'>
                                                {note}
                                                <button onClick={() => DeleteNotification(index)} className='ml-4 text-md italic'>
                                                    &#x1F5D1;
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <form onSubmit={addnotification} className='flex w-full'>
                                <input
                                    type='text'
                                    value={getnote}
                                    onChange={(e) => setnote(e.target.value)}
                                    placeholder='Enter Notification'
                                    className='flex w-full bg-black border-2 border-white rounded-full text-white p-1'
                                />
                                <button
                                    onClick={addnotification}
                                    className='h-10 w-10 rounded-full text-center text-3xl font-extrabold font-serif flex justify-center items-center bg-green-500 text-white'
                                >
                                    +
                                </button>
                            </form>

                        </div>
                    ) : (
                        <div>No Data Found</div>
                    )

                )}

            </div>
        </>
    );
}
export default Tasks;