import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please enter the input fields');
            return;
        }
        
        // const response = await fetch('http://127.0.0.1:8000/api/login/', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ username, password })
        // });

        // const data = await response.json();
        
        // if (response.ok) {
        //     alert('Login successful');
        //     navigate('/'); // Redirect to home page on successful login
        // } else {
        //     setError(data.error || 'Invalid credentials');
        // }
        navigate('/');
    };

    return (
        <div className='w-full h-full'>
            <header className='w-full h-[80px] border-b border-gray-300 flex justify-between px-10 items-center'>
                <h2 className='text-3xl font-bold'>KG
                    <span className='text-blue-500'>CAR</span>
                </h2>
            </header>
            <section className='h-[calc(100vh-80px)] w-full flex justify-center items-center'>
                <div className='flex items-center justify-center flex-col w-[35%] h-[80%] border border-gray-300 rounded-lg p-5'>
                    <h2 className='text-3xl font-bold'>Login</h2>
                    {error && <p className='mt-2 text-red-500'>{error}</p>}
                    <form className='w-[50%] mt-10' onSubmit={handleLogin}>
                        <div className='flex flex-col items-start mb-5'>
                            <h3 className='text-lg font-bold'>Username:</h3>
                            <input type='text' name='username' value={username} onChange={(e) => setUsername(e.target.value)}
                                className='w-full h-[40px] outline-none border border-gray-300 rounded-lg px-3' required />
                        </div>
                        <div className='flex flex-col items-start mb-5'>
                            <h3 className='text-lg font-bold'>Password:</h3>
                            <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)}
                                className='w-full h-[40px] outline-none border border-gray-300 rounded-lg px-3' required />
                        </div>
                        <button type='submit' className='w-full h-[40px] rounded-lg px-3 font-semibold text-white bg-blue-500'>Login</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Login;
