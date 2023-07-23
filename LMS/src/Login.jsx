import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './Configuration';

initializeApp(firebaseConfig);

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [check, setcheck] = useState(false);
    const [name, setname] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            const uid = user.uid;
            console.log('User authenticated with ID:', uid);
            localStorage.setItem('name', email.slice(0, email.indexOf('@')));
            setname(email.slice(0, email.indexOf('@')));
            if (email.slice(email.indexOf('@'), email.length) === '@lms.com') {
                navigate('/Admin_Dashboard')
            } else {
                navigate('/User_Dashboard')
            }
        } catch (error) {
            setIsLoggedIn(false);
            setError('Invalid Email or Password');
            setEmail('');
            setPassword('');
        }
        // console.log('email:', email);
        // console.log('password:', password);
        // console.log('whose email: ', email.slice(email.indexOf('@'), email.length));
    };
    return (
        <>
            <form onSubmit={handleSubmit} className="m-5 mt-0 p-6 w-4/5 border-2 border-blue-900 bg-[#170c27] backdrop-filter backdrop-blur-md shadow-lg shadow-teal-100 rounded-md">
                <div className='flex justify-center items-center'>
                    <h2 className="text-3xl mb-2 font-serif text-justify italic font-semibold text-white text-opacity-90" >Nice to See you</h2>
                </div>
                <div className='flex justify-center items-center'>
                    <h3 className="text-white block mb-5 font-serif italic">
                        Please enter your details.
                    </h3>
                </div>
                <label htmlFor="email" className="block mb-6 text-white font-serif italic">
                    Email
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="border mt-2 border-blue-500 p-2 w-full rounded-md focus:outline-none focus:border-teal-500 bg-transparent text-white"
                    />
                </label>

                <label htmlFor="password" className="block mb-3 text-white font-serif italic">
                    Password
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="border mt-2 border-blue-500 p-2 w-full rounded-md focus:outline-none focus:border-teal-500 bg-transparent text-white"
                        autoComplete='new-password'
                    />
                </label>

                {!check && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <div className="flex items-center justify-between mb-5">
                    <label htmlFor="check-box" className='appearance-none w-32 h16 rounded-md cursor-pointer text-white'>
                        <input type="checkbox" id="check-box" className="text-white mr-2 font-serif " />
                        Remember Me
                    </label>

                    <a href="#!" className="text-teal-500 text-sm underline italic font-serif">
                        Forgot Password?
                    </a>
                </div>
                <button
                    type="submit"
                    className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md transition duration-300"
                >
                    Sign in
                </button>
                <p className='text-center'>
                    <a href="#!" className="text-teal-500 text-sm hover:underline">
                        Don't have an account? Sign up
                    </a>
                </p>
            </form>
        </>
    )
}
export default Login;