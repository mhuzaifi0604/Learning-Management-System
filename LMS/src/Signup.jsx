import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './Configuration';

initializeApp(firebaseConfig);

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [check, setcheck] = useState(false);
    const [instruction, setinstruction] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(email.slice(email.indexOf('@'), email.length) === '@lms.com'){
            setError('This Domain cannot be used by users & admin are not to be signed up.');
        } else{
        try {
            const auth = getAuth();
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            const uid = user.uid;
            console.log('User authenticated with ID:', uid);
            setError('');
            setinstruction('Successfully SignedUp. Login To Access Dashboard!')
        } catch (error) {
            setError('SomeThing Went Wrong!');
        }
    }
        console.log('email:', email);
        console.log('password:', password);
    };
    return (
        <>
            <form onSubmit={handleSubmit} className="m-5 mt-0 p-6 w-3/5 border-2 border-black bg-gray-200 shadow-lg shadow-black rounded-md">
                <div className='flex justify-center items-center'>
                    <h2 className="text-3xl mb-2 font-serif text-justify italic font-semibold text-black text-opacity-90" >Let's Sign You up!</h2>
                </div>
                <div className='flex justify-center items-center'>
                    <h3 className="text-black block mb-5 font-serif italic">
                        Please enter your Credentials.
                    </h3>
                </div>
                <label htmlFor="email" className="block mb-6 text-black font-serif italic font-bold">
                    Email
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="border mt-2 border-black p-2 w-full rounded-md focus:outline-none focus:border-teal-500 bg-transparent text-white"
                    />
                </label>

                <label htmlFor="password" className="block mb-3 text-black font-serif italic font-bold">
                    Password
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="border mt-2 border-black p-2 w-full rounded-md focus:outline-none focus:border-teal-500 bg-transparent text-white"
                        autoComplete='new-password'
                    />
                </label>

                {!check && <p className="text-red-500 text-sm mb-3">{error}</p>}
                {!error && <p className="text-teal-500 text-sm mb-3">{instruction}</p>}

                <button
                    type="submit"
                    className="bg-black text-white py-2 px-4 rounded-md transition duration-300 mt-4"
                >
                    Sign Up
                </button>
                <p className='text-center'>
                    <a href="#!" className="text-black text-sm hover:underline italic">
                        Already have an account? Sign up
                    </a>
                </p>
            </form>
        </>
    )
}
export default SignUp;