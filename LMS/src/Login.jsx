//Making important imports
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './Configuration';
import axios from "axios";

// initializing firebase application
initializeApp(firebaseConfig);

function Login({ setIsLoggedIn }) {
    // necessory state variable declarations
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [check, setcheck] = useState(false);
    const [name, setname] = useState('');

    // function for handling the submission of form/ Clicking of sign In button
    const handleSubmit = async (event) => {
        // preventing default actions
        event.preventDefault();
        // using try catch for successfull and denail of events
        try {
            // checking if email entered belongs to an Admin or a User
            if (email.slice(email.indexOf('@'), email.length) === '@lms.com') {
                // getting auth token from firebase
                const auth = getAuth();
                // signing in firebase using form entered email password and token above with asynchronus function
                await signInWithEmailAndPassword(auth, email, password);
                const user = auth.currentUser;
                const uid = user.uid;
                // setting name of admin in localstorage for later use
                localStorage.setItem('name', email.slice(0, email.indexOf('@')));
                // setters for state variables
                setname(email.slice(0, email.indexOf('@')));
                setIsLoggedIn(true);
                navigate('/Admin_Dashboard'); //navigating to Admin Dashboard in successfull authentication
            
            } else { // implementing authentication for Users
                // getting user from Local Server API
                const response = await axios.get(`http://localhost:6969/data?email=${email}`);
                // checking status and password of user against its details based on email in API
                if (response.data.status === 'enabled' && response.data.password === password) {
                    // setters for state variables
                    localStorage.setItem('mail', email);
                    setIsLoggedIn(true);
                    navigate('/User_Dashboard');// navigating to user dashboard
                } else { // check for invalid password or disabled user
                    setError('Access Denied OR Password did not match - Contact Admin!');
                    setEmail('');
                    setPassword('');
                }
            }
        } catch (error) { // check for accounts found in firebase or not
            setError('Invalid Email or Password');
            setEmail('');
            setPassword('');
        }
    };

    return (
        <>
            {/* Login Form for Authentication */}
            <form onSubmit={handleSubmit} className="m-5 mt-0 p-6 w-3/5 border-2 border-black bg-gray-200 shadow-lg shadow-black rounded-md">
                <div className='flex justify-center items-center'>
                    <h2 className="text-3xl mb-2 font-serif text-justify italic font-semibold text-black text-opacity-90" >Nice to See you</h2>
                </div>
                <div className='flex justify-center items-center'>
                    <h3 className="text-black block mb-5 font-serif italic">
                        Please enter your details.
                    </h3>
                </div>
                {/* Input field for email of the user */}
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
                {/* Input field for password of the user */}
                <label htmlFor="password" className="block mb-3 text-black font-serif font-bold italic">
                    Password
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="border mt-2 border-black p-2 w-full rounded-md text-black"
                    />
                </label>
                {/* displaying errors if any */}
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
                {/* Sign In Button */}
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