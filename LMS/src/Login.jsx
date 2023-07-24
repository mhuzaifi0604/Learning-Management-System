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
            <form onSubmit={handleSubmit} className="m-5 mt-0 p-6 w-3/5 border-2 border-black bg-gray-200 shadow-lg shadow-black rounded-md">
                <div className='flex justify-center items-center'>
                    <h2 className="text-3xl mb-2 font-serif text-justify italic font-semibold text-black text-opacity-90" >Nice to See you</h2>
                </div>
                <div className='flex justify-center items-center'>
                    <h3 className="text-black block mb-5 font-serif italic">
                        Please enter your details.
                    </h3>
                </div>
                <label htmlFor="email" className="block mb-6 text-black font-serif font-bold italic">
                    Email
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="border mt-2 border-black p-2 w-full rounded-md text-black"
                    />
                </label>

                <label htmlFor="password" className="block mb-3 text-black font-serif font-bold italic">
                    Password
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="border mt-2 border-black p-2 w-full rounded-md text-black"
                        autoComplete='new-password'
                    />
                </label>

                {!check && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <div className="flex items-center justify-between mb-5">
                    <label htmlFor="check-box" className='appearance-none w-32 h16 rounded-md cursor-pointer text-black font-bold text-sm'>
                        <input type="checkbox" id="check-box" className="text-white mr-2 font-serif" />
                        Remember Me
                    </label>

                    <a href="#!" className="text-black text-sm underline italic font-bold font-serif">
                        Forgot Password?
                    </a>
                </div>
                <button
                    type="submit"
                    className="bg-black text-white py-2 px-4 rounded-md font-serif font-extrabold"
                >
                    Sign in
                </button>
                <p className='text-center'>
                    <a href="#!" className="text-black text-sm hover:underline italic">
                        Don't have an account? Sign up
                    </a>
                </p>
            </form>
        </>
    )
}
export default Login;