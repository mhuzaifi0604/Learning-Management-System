import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import high from '../assets/high.png';
import medium from '../assets/medium.png';
import low from '../assets/low.png';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaperPlane, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
library.add(faPaperPlane, faGear, faRightFromBracket);

function User() {
    const email = localStorage.getItem('mail');
    const [data, setData] = useState({});
    const [msg, setmsg] = useState('');
    const [doinghigh, setdoinghigh] = useState(() => {
        const storedData = localStorage.getItem('doinghigh');
        return storedData ? JSON.parse(storedData) : [];
    });
    const [doingmid, setdoingmid] = useState(() => {
        const storedData = localStorage.getItem('doingmid');
        return storedData ? JSON.parse(storedData) : [];
    });
    const [doinglow, setdoinglow] = useState(() => {
        const storedData = localStorage.getItem('doinglow');
        return storedData ? JSON.parse(storedData) : [];
    });
    const [donehigh, setdonehigh] = useState(() => {
        const storedData = localStorage.getItem('donehigh');
        return storedData ? JSON.parse(storedData) : [];
    });
    const [donemid, setdonemid] = useState(() => {
        const storedData = localStorage.getItem('donemid');
        return storedData ? JSON.parse(storedData) : [];
    });
    const [donelow, setdonelow] = useState(() => {
        const storedData = localStorage.getItem('donelow');
        return storedData ? JSON.parse(storedData) : [];
    });
    const doneempty = donehigh.length > 0 || donemid.length > 0 || donelow.length > 0;
    const bg_url = 'https://e1.pxfuel.com/desktop-wallpaper/461/478/desktop-wallpaper-whatsapp-dark-whatsapp-chat.jpg';
    const name = localStorage.getItem('name');
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('doinghigh', JSON.stringify(doinghigh));
        localStorage.setItem('doingmid', JSON.stringify(doingmid));
        localStorage.setItem('doinglow', JSON.stringify(doinglow));
    }, [doinghigh, doingmid, doinglow]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:6969/data?email=${email}`);
                setData(response.data);
            } catch (error) {
                console.error('Error Fetching Data', error);
            }
        };

        fetchData();
    }, [email]);


    if (!data || !data.tasks) {
        return <div>Loading...</div>;
    }
    const highPriorityTasks = data.tasks.filter((task) => task.priority === 'high');
    const mediumPriorityTasks = data.tasks.filter((task) => task.priority === 'medium');
    const lowPriorityTasks = data.tasks.filter((task) => task.priority === 'low');

    const handleclick = async (task) => {
        try {
            const str = task.task;
            const response = await axios.delete(`http://localhost:6969/tasks/${task.task}`);
            console.log('Task Deleted Successfully');
            if (task.priority === 'high') {
                setdoinghigh([...doinghigh, task.task]);
            } else if (task.priority === 'medium') {
                setdoingmid([...doingmid, task.task]);
            } else if (task.priority === 'low') {
                setdoinglow([...doinglow, task.task]);
            }
            setData((prevData) => ({
                ...prevData,
                tasks: prevData.tasks.filter((t) => t.task !== task.task),
            }));
        } catch (error) {
            console.error('error deleting task', error);
        }
        console.log('Button got clicked');
    }
    const handledoingshigh = (task) => {
        console.log('button got clicked');
        const index = doinghigh.findIndex((t) => t === task);
        console.log('index: ', index);
        if (index !== -1) {
            const deletedTask = doinghigh.splice(index, 1)[0];
            console.log('deleted task: ', deletedTask);
            setdoinghigh([...doinghigh]); // Update the state to re-render the component
            setdonehigh((prevDoneHigh) => [...prevDoneHigh, deletedTask]);
            localStorage.setItem('doinghigh', JSON.stringify(doinghigh)); // Update the localStorage for 'doinghigh'
            localStorage.setItem('donehigh', JSON.stringify([...donehigh, deletedTask])); // Update the localStorage for 'donehigh'
            console.log('high priority task got deleted');
        }
    }
    const handledoingsmid = (task) => {
        const index = doingmid.findIndex((t) => t === task);
        if (index !== -1) {
            const deletedTask = doingmid.splice(index, 1)[0];
            setdoingmid([...doingmid]); // Update the state to re-render the component
            setdonemid((prevDoneMid) => [...prevDoneMid, deletedTask]);
            localStorage.setItem('doingmid', JSON.stringify(doingmid)); // Update the localStorage for 'doingmid'
            localStorage.setItem('donemid', JSON.stringify([...donemid, deletedTask])); // Update the localStorage for 'donemid'
            console.log('mid priority task got deleted');
        }
    }
    const handledoingslow = (task) => {
        const index = doinglow.findIndex((t) => t === task);
        if (index !== -1) {
            const deletedTask = doinglow.splice(index, 1)[0];
            setdoinglow([...doinglow]); // Update the state to re-render the component
            setdonelow((prevDoneLow) => [...prevDoneLow, deletedTask]);
            localStorage.setItem('doinglow', JSON.stringify(doinglow)); // Update the localStorage for 'doinglow'
            localStorage.setItem('donelow', JSON.stringify([...donelow, deletedTask])); // Update the localStorage for 'donelow'
            console.log('low priority task got deleted');
        }
    }
    const addnote = async () => {
        const new_notificaition = {
            role: 'user',
            note: msg
        }
        try {
            await axios.post('http://localhost:6969/add-notification', {
                email: data.email,
                data: new_notificaition,
            });
            setmsg('');
            console.log('New Note Added successfully!');
        } catch (error) {
            console.error('something went wrong: ', error);
        }

    }
    const reset = () => {
        setdonehigh([]);
        setdonemid([]);
        setdonelow([]);
        localStorage.removeItem('donehigh');
        localStorage.removeItem('donemid');
        localStorage.removeItem('donelow');
    }

    return (
        <>
            <div className='flex flex-col h-screen bg-[#3e5e51]'>
            <div className="flex items-center">
      <h1 className="flex-1 text-center font-bold text-3xl text-white font-mono mb-3">
        Welcome {name[0].toUpperCase()}{name.slice(1)}
      </h1>
      <button onClick={() => navigate('/User_Dashboard/Account-Settings')}>
      <FontAwesomeIcon icon={faGear} className="text-sm text-white p-1 bg-[#075e55] mr-4 h-8 w-8 rounded-lg border hover:shadow-lg hover:shadow-black" />
      
      </button>
      <button  onClick={() => {navigate('/'); localStorage.setItem('login', false)}}>
      <FontAwesomeIcon icon={faRightFromBracket} className="text-sm text-white p-1 bg-[#075e55] mr-4 h-8 w-8 rounded-lg border hover:shadow-lg hover:shadow-black" />
      </button>
      
    </div>
                {/* Everything Below Heading */}
                <div className='flex w-full h-full gap-2'>
                    {/*Full Do's Grid*/}
                    <div className='flex flex-1 flex-col bg-black rounded-lg items-center h-max ml-1'>
                        <h2 className='text-md font-semibold text-white font-sans p-2'>To Do</h2>
                        <div className='flex border border-white w-5/6 mt-1 mb-6'></div>
                        <div className='grid grid-rows-3 h-max w-5/6 gap-4 mb-4'>
                            {highPriorityTasks.length > 0 && (
                                <div className='flex flex-col rounded-lg bg-[#216e4e] justify-center items-left font-semibold font-sans italic text-lg text-white h-max p-2'>
                                    <span className='flex w-full justify-end mb-2'>
                                        <p className='text-sm font-sans font-bold mt-6 text-[#e51d06]'>High priority</p>
                                        <img src={high} alt='no image found' className='h-16 w-20' />
                                    </span>
                                    {highPriorityTasks.map((task, index) => (
                                        <li key={index}>
                                            {task.task}
                                            <button onClick={() => handleclick(task)} className='ml-10 shadow-md shadow-black rounded-md hover:h-7 hover:w-7'>✔</button>
                                        </li>
                                    ))}
                                </div>
                            )}

                            {mediumPriorityTasks.length > 0 && (
                                <div className='flex flex-col rounded-lg bg-[#943d73] justify-center items-left font-semibold font-sans italic text-lg text-white h-max p-2 mt-3'>
                                    <span className='flex w-full justify-end mb-2'>
                                        <p className='text-sm font-sans font-bold mt-6 text-[#feb82f]'>Mid priority</p>
                                        <img src={medium} alt='no image found' className='h-16 w-20' />

                                    </span>
                                    {mediumPriorityTasks.map((task, index) => (
                                        <li key={index}>
                                            {task.task}
                                            <button onClick={() => handleclick(task)} className='ml-10 shadow-md shadow-black rounded-md hover:h-7 hover:w-7'>✔</button>
                                        </li>
                                    ))}
                                </div>
                            )}

                            {lowPriorityTasks.length > 0 && (
                                <div className='flex flex-col rounded-lg bg-[#206b74] justify-center items-left font-semibold font-sans italic text-lg text-white h-max p-2'>
                                    <span className='flex w-full justify-end mb-2'>
                                        <p className='text-sm font-sans font-bold mt-6 text-[#b1d43a]'>Low priority</p>
                                        <img src={low} alt='no image found' className='h-16 w-20' />
                                    </span>
                                    {lowPriorityTasks.map((task, index) => (
                                        <li key={index}>
                                            {task.task}
                                            <button onClick={() => handleclick(task)} className='ml-10 shadow-md shadow-black rounded-md hover:h-7 hover:w-7'>✔</button>
                                        </li>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/*Full Doing's Grid*/}
                    <div className='flex flex-1 flex-col bg-black rounded-lg items-center h-max'>
                        <h2 className='text-md font-semibold text-white font-sans p-2'>Doing</h2>
                        <div className='flex border border-white w-5/6 mt-1 mb-6'></div>
                        <div className='grid grid-rows-3 h-max w-5/6 gap-4 mb-4'>
                            {doinghigh.length > 0 && (
                                <div className='flex flex-col rounded-lg bg-[#216e4e] justify-center items-left font-semibold font-sans italic text-lg text-white h-max p-2'>
                                    <span className='flex w-full justify-end mb-2'>
                                        <p className='text-sm font-sans font-bold mt-6 text-[#e51d06]'>High priority</p>
                                        <img src={high} alt='no image found' className='h-16 w-20' />
                                    </span>
                                    {doinghigh.map((task, index) => (
                                        <li key={index}>
                                            {task}
                                            <button onClick={() => handledoingshigh(task)} className='ml-10 shadow-md shadow-black rounded-md hover:h-7 hover:w-7'>✔</button>
                                        </li>
                                    ))}
                                </div>
                            )}
                            {doingmid.length > 0 && (
                                <div className='flex flex-col rounded-lg bg-[#943d73] justify-center items-left font-semibold font-sans italic text-lg text-white h-max p-2'>
                                    <span className='flex w-full justify-end mb-2'>
                                        <p className='text-sm font-sans font-bold mt-6 text-[#feb82f]'>Mid priority</p>
                                        <img src={medium} alt='no image found' className='h-16 w-20' />

                                    </span>
                                    {doingmid.map((task, index) => (
                                        <li key={index}>
                                            {task}
                                            <button onClick={() => handledoingsmid(task)} className='ml-10 shadow-md shadow-black rounded-md hover:h-7 hover:w-7'>✔</button>
                                        </li>
                                    ))}
                                </div>
                            )}
                            {doinglow.length > 0 && (
                                <div className='flex flex-col rounded-lg bg-[#206b74] justify-center items-left font-semibold font-sans italic text-lg text-white h-max p-2'>
                                    <span className='flex w-full justify-end mb-2'>
                                        <p className='text-sm font-sans font-bold mt-6 text-[#b1d43a]'>Low priority</p>
                                        <img src={low} alt='no image found' className='h-16 w-20' />
                                    </span>
                                    {doinglow.map((task, index) => (
                                        <li key={index}>
                                            {task}
                                            <button onClick={() => handledoingslow(task)} className='ml-10 shadow-md shadow-black rounded-md hover:h-7 hover:w-7'>✔</button>
                                        </li>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/*Full Dones Grid*/}
                    <div className='flex flex-1 flex-col bg-black rounded-lg items-center h-max relative'>
                        <h2 className='text-md font-semibold text-white font-sans p-2'>Done</h2>
                        <div className='flex border border-white w-5/6 mt-1 mb-6'></div>
                        <div className='grid grid-rows-3 h-max w-5/6 gap-4 mb-4'>
                            {donehigh.length > 0 && (
                                <div className='flex flex-col rounded-lg bg-[#216e4e] justify-center items-left font-semibold font-sans italic text-lg text-white h-max p-2'>
                                    <span className='flex w-full justify-end mb-2'>
                                        <p className='text-sm font-sans font-bold mt-6 text-[#e51d06]'>High priority</p>
                                        <img src={high} alt='no image found' className='h-16 w-20' />
                                    </span>
                                    {donehigh.map((task, index) => (
                                        <li key={index}>
                                            {task}
                                        </li>
                                    ))}
                                </div>
                            )}
                            {donemid.length > 0 && (
                                <div className='flex flex-col rounded-lg bg-[#943d73] justify-center items-left font-semibold font-sans italic text-lg text-white h-max p-2'>
                                    <span className='flex w-full justify-end mb-2'>
                                        <p className='text-sm font-sans font-bold mt-6 text-[#feb82f]'>Mid priority</p>
                                        <img src={medium} alt='no image found' className='h-16 w-20' />

                                    </span>
                                    {donemid.map((task, index) => (
                                        <li key={index}>
                                            {task}
                                        </li>
                                    ))}
                                </div>
                            )}
                            {donelow.length > 0 && (
                                <div className='flex flex-col rounded-lg bg-[#206b74] justify-center items-left font-semibold font-sans italic text-lg text-white h-max p-2'>
                                    <span className='flex w-full justify-end mb-2'>
                                        <p className='text-sm font-sans font-bold mt-6 text-[#b1d43a]'>Low priority</p>
                                        <img src={low} alt='no image found' className='h-16 w-20' />
                                    </span>
                                    {donelow.map((task, index) => (
                                        <li key={index}>
                                            {task}
                                        </li>
                                    ))}
                                </div>
                            )}
                            {doneempty && (
                                <button onClick={reset}
                                    className='shadow-md hover:shadow-white rounded-md h-8 w-14 shadow-gray-400 border-white font-bold border p-1 text-gray-400 hover:text-white absolute bottom-4 right-4 '
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={`flex flex-1 flex-col rounded-xl bg-[url] bg-cover bg-center mb-4 mr-1`} style={{ backgroundImage: `url(${bg_url})` }}>
                        <h2 className='text-md font-semibold text-white font-sans bg-[#075e55] p-2 text-center rounded-t-lg'>Notifications</h2>
                        <div className='flex flex-col h-full w-full'>
                            {data.notifications.length > 0 &&
                                data.notifications.map((note, index) => (
                                    <li key={index}
                                        className={classNames('bg-[#075e55] rounded-lg p-2 h-max w-max justify-start text-start text-white italic m-2', {
                                            'self-start': note.role === 'admin',
                                            'self-end': note.role === 'user',
                                            'list-none': true
                                        })}
                                    >
                                        {note.note}
                                    </li>
                                ))}
                        </div>
                        <form className='flex w-full bg-[#171717] h-16 rounded-lg'>
                            <input
                                className='flex w-5/6 h-8 rounded-full bg-[#29282b] mt-3 ml-2 p-2 text-white italic placeholder:text-gray-400'
                                placeholder='Type Here...'
                                value={msg}
                                onChange={(e) => setmsg(e.target.value)}
                            />
                            <button
                                onClick={addnote}
                                className='h-8 bg-[#075e55] w-10 ml-1 mt-3 rounded-md text-2xl'
                            >
                                <FontAwesomeIcon icon={faPaperPlane} className='text-white text-md' />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default User;
