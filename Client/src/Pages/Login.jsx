import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KiteImg from '../assets/kgkite.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset error state
        setLoading(true); // Set loading to true

        // Basic validation
        if (!username || !password) {
            setError('Please enter both username and password.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }
        navigate('/new-entry');
        // try {
        //     const response = await fetch('http://127.0.0.1:8000/api/login/', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ username, password }),
        //     });

        //     const data = await response.json();

        //     if (response.ok) {
        //         alert('Login successful');
        //         navigate('/new-entry'); // Redirect to home page after successful login
        //     } else {
        //         setError(data.error || 'Invalid credentials');
        //     }
        // } catch (error) {
        //     setError('Server error. Please try again later.');
        // } finally {
        //     setLoading(false); // Reset loading state
        // }
    };

    return (
        <div className='flex flex-col w-full h-screen'>
            <header className='w-full h-[80px] border-b border-gray-300 flex justify-between px-10 items-center'>
                <h2 className='text-3xl font-bold'>KG
                    <span className='text-blue-500'>CAR</span>
                </h2>
            </header>
            <section className='h-[calc(100vh-80px)] w-full flex justify-center items-center'>
                <div className='w-[60%] h-[70%] border border-gray-300 rounded flex shadow-lg overflow-hidden'>
                    <div className='w-[50%] h-full flex justify-center items-center'>
                        <img src={KiteImg} alt="Login Illustration" className='w-[80%]' />
                    </div>

                    <div className='w-[50%] h-full flex flex-col justify-center items-center p-5'>
                        <h2 className='mb-5 text-2xl font-bold'>Login Now...!</h2>
                        

                        <form className='w-[80%] space-y-7' onSubmit={handleLogin}>
                            <div className='flex flex-col gap-3'>
                                <label className='block font-semibold'>Username:</label>
                                <input
                                    type='text'
                                    name='username'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className='w-full h-[40px] outline-none border border-gray-300 rounded-lg px-3'
                                />
                            </div>
                            <div className='flex flex-col gap-3'>
                                <label className='block font-semibold'>Password:</label>
                                <input
                                    type='password'
                                    name='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='w-full h-[40px] outline-none border border-gray-300 rounded-lg px-3'
                                />
                            </div>
                            {error && <p className='mb-3 text-red-500'>{error}</p>}
                            <button
                                type='submit'
                                disabled={loading} // Disable button when loading
                                className='w-full h-[40px] rounded-lg px-3 font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300'
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                            <p>Forgot account Name or Password? <span className='text-blue-500 cursor-pointer'>Contact Admin</span></p>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;