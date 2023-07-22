import React, { useState } from 'react';
import file from './assets/file.jpg';
import Login from '../src/Login';
import SignUp from '../src/Signup';

function Home() {
  const [check, setcheck] = useState(true);
  
  return (

    <div className='flex flex-grow flex-shrink h-screen w-screen'>
      <div className='flex flex-col flex-grow basis-1/2 justify-center items-center overflow-auto bg-[#212134]'>
        <div className='flex w-4/5 border-2 border-blue-900 bg-[#170c27] backdrop-filter backdrop-blur-md rounded-md'>
          <div className='basis-1/2 text-center font-serif text-xl text-white'>
            <button
              onClick={() => {setcheck(true);}}
              className={`italic font-bold p-1 ${check ? 'underline' : ''}`}
              
            >
              SignIn
            </button>
          </div>
          <div className='basis-1/2 text-center font-serif text-xl text-white'>
            <button
              onClick={() => {setcheck(false);}}
              className={`italic font-bold p-1 ${!check ? 'underline' : ''}`}
            >
              SignUp
            </button>
          </div>
        </div>
        { check ? <Login/> : <SignUp/> }
      </div>
      <div className='flex flex-grow basis-1/2 overflow-auto bg-gray-400 text-black'>
        <img
          src={file}
          alt="image from unsplash"
          className="w-full object-cover"
        />
      </div>
    </div>
  )
}
export default Home;