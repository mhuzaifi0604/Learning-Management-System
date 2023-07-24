import React, { useState, useEffect } from 'react';
import axios from 'axios';
import high from '../assets/high.png';
import medium from '../assets/medium.png';
import low from '../assets/low.png';

function User() {
    const [data, setData] = useState(null);
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
    // const [doingmid, setdoingmid] = useState([]);
    // const [doinglow, setdoinglow] = useState([]);

    useEffect(() => {
        // This effect will run every time the `doinghigh` state is updated
        localStorage.setItem('doinghigh', JSON.stringify(doinghigh));
        localStorage.setItem('doingmid', JSON.stringify(doingmid));
        localStorage.setItem('doinglow', JSON.stringify(doinglow));
    }, [doinghigh, doingmid, doinglow]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:6969/data');
                setData(response.data);
            } catch (error) {
                console.error('Error Fetching Data', error);
            }
        };

        fetchData();
    }, []);


    if (!data) {
        return <div>Loading...</div>;
    }
    const highPriorityTasks = data.tasks.filter((task) => task.priority === 'high');
    const mediumPriorityTasks = data.tasks.filter((task) => task.priority === 'medium');
    const lowPriorityTasks = data.tasks.filter((task) => task.priority === 'low');

    const handleclick = async(task) => {
        console.log('Task content being sent in DELETE request:', task.task);
        try {
            if(task.priority === 'high'){
                setdoinghigh([...doinghigh, task.task]);
            } else if (task.priority === 'medium'){
                setdoingmid([...doingmid, task.task]);
            } else if (task.priority === 'low'){
                setdoinglow([...doinglow, task.task]);
            }
            const response = await axios.delete(`http://localhost:6969/tasks/${task.task}`);
            console.log('Task Deleted Successfully');
            console.log('doinghigh array: ', doinghigh);
            setData((prevData) => ({
                ...prevData,
                tasks: prevData.tasks.filter((t) => t.task !== task.task),
            }));
            //window.location.reload();
        } catch (error) {
            console.error('error deleting task', error);
        }
        console.log('Button got clicked');
    }
    return (
        <>
            <div className='flex flex-col h-screen bg-[#3e5e51]'>
                <h1 className='text-center font-bold text-3xl text-white font-mono mb-3'>User's Dashboard.</h1>
                {/* Everything Below Heading */}
                <div className='flex w-full h-full gap-2'>
                    {/*Full Do's Grid*/}
                    <div className='flex flex-1 flex-col bg-black rounded-lg items-center h-max ml-1'>
                        <h2 className='text-md font-semibold text-white font-sans p-2'>To Do</h2>
                        <div className='grid grid-rows-3 h-max w-5/6 gap-4'>
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
                        <div className='grid grid-rows-3 h-max w-5/6 gap-4'>
                            {doinghigh.length > 0 && (  
                                <div className='flex flex-col rounded-lg bg-[#216e4e] justify-center items-left font-semibold font-sans italic text-lg text-white h-max p-2'>
                                   <span className='flex w-full justify-end mb-2'>
                                        <p className='text-sm font-sans font-bold mt-6 text-[#e51d06]'>High priority</p>
                                        <img src={high} alt='no image found' className='h-16 w-20' />
                                    </span>
                                    {doinghigh.map((task, index) => (
                                        <li key={index}>
                                            {task}
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
                                        </li>
                                    ))}
                                </div>
                            )}
                            {/* <div className='flex border rounded-lg bg-[#ffa500] justify-center items-center font-semibold font-serif italic text-2xl'>Medium Priority</div>
                            <div className='flex border rounded-lg bg-[#4c6b1f] justify-center items-center font-semibold font-serif italic text-2xl'>Low Priority</div> */}
                        </div>
                    </div>
                    {/*Full Don'ts Grid*/}
                    <div className='flex flex-1 flex-col border border-black bg-black rounded-lg items-center'>
                        <h2 className='text-md font-semibold text-white font-sans p-2'>Done</h2>
                        <div className='grid grid-rows-3 h-full w-5/6 gap-4 mb-2'>
                            <div className='flex border rounded-lg bg-[#ae2a19] justify-center items-center font-semibold font-serif italic text-2xl'>High Priority</div>
                            <div className='flex border rounded-lg bg-[#ffa500] justify-center items-center font-semibold font-serif italic text-2xl'>Medium Priority</div>
                            <div className='flex border rounded-lg bg-[#4c6b1f] justify-center items-center font-semibold font-serif italic text-2xl'>Low Priority</div>
                        </div>
                    </div>
                    <div className='flex flex-1 flex-col border border-pink-600'>
                        <h2 className='text-center text-xl font-bold text-white bg-red-600 p-2'>Notifications</h2>
                    </div>
                </div>
            </div>
            {/* <div className='flex flex-col justify-center items-center h-screen w-screen bg-[#3e5e51]'>
        <h1 className='flex text-center font-extrabold font-3xl text-white font-serif italic'>This is User's Dashboard.</h1>
        <table className='flex w-4/5 bg-green-50'>
          <thead>
            <tr>
              <td className='border basis-1/4'>Attribute</td>
              <td className='border basis-3/4'>Value</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='border basis-1/4 font-bold font-serif italic text-black'>Email</td>
              <td className='border basis-3/4 font-bold font-serif italic text-black'>{data.email}</td>
            </tr>
            <tr>
              <td className='border basis-1/4 font-bold font-serif italic text-black'>Status</td>
              <td className='border basis-3/4 font-bold font-serif italic text-black'>{data.status}</td>
            </tr>
            {data.tasks.map((task, index) => (
              <tr key={index}>
                <td className='border basis-1/4 font-bold font-serif italic text-black'>Task # {index + 1}</td>
                <td className='border basis-2/4 font-bold font-serif italic text-black'>{task.task}</td>
                <td className='border basis-1/4 font-bold font-serif italic text-black'>{task.priority}</td>
              </tr>
            ))}
            {data.notifications.map((note, index) => (
              <tr key={index}>
                <td className='border basis-1/4 font-bold font-serif italic text-black'>Notification # {index + 1}</td>
                <td className='border basis-2/4 font-bold font-serif italic text-black'>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
        </>
    );
}

export default User;
