import React, { useState } from 'react';
import file from './assets/file.jpg';
import Login from '../src/Login';
import SignUp from '../src/Signup';

function Home() {
  const [check, setcheck] = useState(true);
  const imageurl = 'https://img.freepik.com/premium-vector/concept-education-school-background-chalkboard-with-different-stuff-welcome-back-school-design-vector_116849-742.jpg?w=2000';
  return (

    <div className='flex flex-grow flex-shrink h-screen w-screen' style={{ backgroundImage: `url(${imageurl})`}}>
      <div className='flex flex-col flex-grow basis-1/2 justify-center items-center overflow-auto'>
        
        { check ? <Login/> : <SignUp/> }
        <div className='flex w-3/5 bg-[#3e5351] backdrop-filter backdrop-blur-md rounded-md'>
          <div className='basis-1/2 text-center font-serif text-xl text-black bg-gray-400 shadow-md shadow-black p-1 rounded-lg border-black border-2'>
            <button
              onClick={() => {setcheck(true);}}
              className={`italic font-bold p-1 ${check ? 'underline' : ''}`}
              
            >
              SignIn
            </button>
          </div>
          <div className='basis-1/2 text-center font-serif text-xl text-black bg-gray-400 shadow-md shadow-black p-1 rounded-lg border-black border-2'>
            <button
              onClick={() => {setcheck(false);}}
              className={`italic font-bold p-1 ${!check ? 'underline' : ''}`}
            >
              SignUp
            </button>
          </div>
        </div>
      </div>
      {/* <div className='flex flex-grow basis-1/2 overflow-auto bg-gray-400 text-black'>
        <img
          src={file}
          alt="image from unsplash"
          className="w-full object-cover"
        />
      </div> */}
    </div>
  )
}
export default Home;