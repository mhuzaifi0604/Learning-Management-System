import react, { useState, useEffect } from 'react';
import axios from 'axios';

function Settings({setIsLoggedIn}) {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [newpass, setnewpass] = useState('');
    const [confirm, setconfirm] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [check, setcheck] = useState(false);
    const [update, setupdate] = useState(false);
    const [error, setError] = useState('');
    const imageurl = 'https://img.freepik.com/premium-vector/concept-education-school-background-chalkboard-with-different-stuff-welcome-back-school-design-vector_116849-742.jpg?w=2000';
    
    useEffect(() => {
        setPasswordsMatch(newpass === confirm);
    }, [newpass, confirm]);
    
    const handleSubmit = async () => {
        if(setPasswordsMatch){
        try {
            const data = {
                email: email,
                password: password,
                newpassword: newpass,
            }
            await axios.put('http://localhost:6969/update-password', {
                data: data
            });
            setpassword('');
            setnewpass('');
            setemail('');
            setupdate(true);
            console.log('Password Updated Successfully!');
        } catch (error) {
            console.error('Something Went Wrong!', error);
        }
    }else{
        setError('Passwords Do not Match!');
    }
    }
    return (
        <>
            <div className='flex justify-center items-center h-screen w-screen' style={{ backgroundImage: `url(${imageurl})`, backgroundSize: '100% auto' }}>

                <form onSubmit={handleSubmit} className="m-5 mt-0 p-6 w-3/5 border-2 border-black bg-gray-200 shadow-lg shadow-black rounded-md">
                    <div className='flex justify-center items-center'>
                        <h2 className="text-3xl mb-2 font-serif text-justify italic font-semibold text-black text-opacity-90" >Want to Change Some Details</h2>
                    </div>
                    <div className='flex justify-center items-center'>
                        <h3 className="text-black block mb-5 font-serif italic">
                            Please enter your Creadentials.
                        </h3>
                    </div>
                    <label htmlFor="email" className="block mb-6 text-black font-serif font-bold italic">
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            placeholder="Enter your email"
                            className="border mt-2 border-black p-2 w-full rounded-md text-black"
                        />
                    </label>

                    <label htmlFor="password" className="block mb-3 text-black font-serif font-bold italic">
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            placeholder="Enter your password"
                            className="border mt-2 border-black p-2 w-full rounded-md text-black"
                            autoComplete='new-password'
                        />
                    </label>
                    <label htmlFor="newpassword" className="block mb-3 text-black font-serif font-bold italic">
                        New Password
                        <input
                            type="password"
                            value={newpass}
                            onChange={(e) => setnewpass(e.target.value)}
                            placeholder="Enter your password"
                            className={`border mt-2 border-black p-2 w-full rounded-md text-black ${passwordsMatch ? 'text-green-700' : ''}`}
                            autoComplete='new-password'
                        />
                    </label>
                    <label htmlFor="newpassword" className="block mb-3 text-black font-serif font-bold italic">
                        Confirm New Password
                        <input
                            type="password"
                            value={confirm}
                            onChange={(e) => setconfirm(e.target.value)}
                            placeholder="Enter your password"
                            className={`border mt-2 border-black p-2 w-full rounded-md text-black ${passwordsMatch ? 'text-green-700' : ''}`}
                            autoComplete='new-password'
                        />
                    </label>

                    {!check && <p className="text-red-500 text-sm mb-3">{error}</p>}
                    {update && <p className="text-green-900 text-sm mb-3 text-center italic font-extrabold">Password Updated successfully!</p>}
                    <button
                        type="submit"
                        className="bg-black text-white py-2 px-4 rounded-md font-serif font-extrabold"
                    >
                        Update
                    </button>
                    <p className='text-center'>
                        <a href="#!" className="text-black text-sm hover:underline italic">
                            Make sure to type in both passwords correctly!
                        </a>
                    </p>
                </form>
            </div>
        </>
    );
}
export default Settings;