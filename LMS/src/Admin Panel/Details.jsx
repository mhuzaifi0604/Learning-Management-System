import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import PulseLoader from 'react-spinners/PulseLoader';
import { useNavigate } from 'react-router-dom';

function Details() {
    const id = localStorage.getItem('message_id');
    const [messageData, setMessageData] = useState(null);
    const [loading, setloading] = useState(false);
    const [editableFields, setEditableFields] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessageDetails = async () => {
            try {
                setloading(true);
                const db = getFirestore();
                const messageRef = doc(db, 'All-Users', id);
                const messageSnapshot = await getDoc(messageRef);
                if (messageSnapshot.exists()) {
                    setMessageData(messageSnapshot.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching message details:', error);
            } finally {
                setloading(false);
            }
        };

        fetchMessageDetails();
    }, [id]);

    const toggleEdit = (field) => {
        setEditableFields((prevEditableFields) => ({
            ...prevEditableFields,
            [field]: !prevEditableFields[field],
        }));
    };

    const handleInputChange = (e, field) => {
        setMessageData((prevMessageData) => ({
            ...prevMessageData,
            [field]: e.target.value,
        }));
    };

    const updateFieldValue = async (field, newValue) => {
        try {
            const db = getFirestore();
            const messageRef = doc(db, 'All-Users', id);
            if (field.startsWith('tasks-')) {
                const index = parseInt(field.split('-')[1]);
                await updateDoc(messageRef, {
                    [`tasks.${index}`]: newValue,
                });
            } else {
                await updateDoc(messageRef, {
                    [field]: newValue,
                });
            }

            console.log('Value updated successfully!');
        } catch (error) {
            console.error('Error updating value:', error);
        }
    };

    const handletasks = () => {
        navigate('/Admin_Dashboard/Assign-Tasks')
    }

    return (
        <>
            <h1 className='text-center'>Change User Details</h1>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <PulseLoader color="teal" size={20} loading={loading} />
                </div>
            ) : messageData ? (
                <div className="flex justify-center h-screen w-screen">
                    <table className="flex flex-col w-4/5 items-center">
                        <thead className='w-full'>
                            <tr className='flex w-full'>
                                <th className="border-2 w-1/6">Attribute</th>
                                <th className="border-2 w-5/6">Value</th>
                            </tr>
                        </thead>
                        <tbody className='w-full'>
                            {Object.entries(messageData).map(([attribute, value]) => {
                                if (attribute !== 'tasks') {
                                    return (
                                        <tr key={attribute} className="flex w-full">
                                            <td className="border text-center w-1/6 text-lg font-serif font-bold italic">
                                                {attribute}
                                            </td>
                                            <td className="border text-center w-5/6 italic">
                                                {editableFields[attribute] ? (
                                                    <input
                                                        type="text"
                                                        value={value}
                                                        onChange={(e) => handleInputChange(e, attribute)}
                                                        className="border w-11/12"
                                                    />
                                                ) : (
                                                    value
                                                )}
                                                <button
                                                    onClick={() => {
                                                        if (editableFields[attribute]) {
                                                            updateFieldValue(attribute, messageData[attribute]);
                                                        }
                                                        toggleEdit(attribute);
                                                    }}
                                                    className={`ml-2 text-blue-500 hover:text-blue-700 ${editableFields[attribute] ? 'cursor-pointer' : ''
                                                        }`}
                                                >
                                                    &#x270F;
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }
                                return null;
                            })}
                            <tr className='flex w-full border justify-center text-lg font-serif font-bold italic'>
                                <td className='flex w-full justify-center items-center'>
                                    Tasks
                                </td>
                                <td>
                                    <button
                                        onClick={handletasks}
                                        className='h-10 w-10 rounded-full text-center text-3xl font-extrabold font-serif flex justify-center items-center bg-green-500 text-white'
                                    >
                                        +
                                    </button>
                                </td>

                            </tr>
                            <tr className='flex w-full'>
                                <th className="border-2 w-1/6">Sr #</th>
                                <th className="border-2 w-4/6">Task</th>
                                <th className="border-2 w-1/6">Priority</th>
                            </tr>
                            {messageData.tasks.map((task, index) => (
                                <tr key={index} className='flex w-full'>
                                    <td className="border text-center w-1/6 text-lg font-serif font-bold italic"># {index + 1}</td>
                                    <td className="border text-center w-4/6 italic font-serif">{task.task}</td>
                                    <td className="border text-center w-1/6 italic font-serif font-bold">{task.priority}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>No data found!</div>
            )}
        </>
    );
}

export default Details;
