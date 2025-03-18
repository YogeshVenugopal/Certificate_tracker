import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KiteImg from '../assets/kgkite.png';
import MessageBox from '../Components/MessageBox';
import { API_CALL } from '../Utils/utils';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [messages, setMessages] = useState([]); // Store multiple messages
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const addMessage = (text, status) => {
        setMessages((prev) => [...prev, { text, status, id: Date.now() }]); // Add unique ID
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!username || !password) {
            addMessage('Please enter both username and password.', 'error');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_CALL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            // console.log(data);
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.username)); 
                addMessage('Login successful! Redirecting...', 'success');

                setTimeout(() => {
                    navigate('/new-entry');
                }, 500);
            } else {
                addMessage(data.error || 'Invalid credentials', 'error');
            }
        } catch (error) {
            addMessage('Server error. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col w-full h-screen'>
            <header className='w-full h-[80px] border-b border-gray-300 flex justify-between px-10 items-center'>
                <h2 className='text-3xl font-bold'>
                    KG <span className='text-blue-500'>CAR</span>
                </h2>
            </header>

            <section className='h-[calc(100vh-80px)] w-full flex justify-center items-center'>
                <div className='w-[60%] h-[70%] border border-gray-300 rounded flex shadow-lg overflow-hidden'>
                    <div className='w-[50%] h-full flex justify-center items-center'>
                        <img src={KiteImg} alt="Login Illustration" className='w-[80%]' />
                    </div>

                    <div className='w-[50%] h-full flex flex-col justify-center items-center p-5'>
                        <h2 className='mb-5 text-2xl font-bold'>Login Now...!</h2>

                        {/* Display multiple MessageBoxes */}
                        <div className="absolute flex flex-col gap-2 transform -translate-x-1/2 top-5 left-1/2">
                            {messages.map((msg) => (
                                <MessageBox key={msg.id} message={msg.text} status={msg.status} />
                            ))}
                        </div>

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

                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full h-[40px] rounded-lg px-3 font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300'
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>

                            <p>Forgot account name or password? <span className='text-blue-500 cursor-pointer'>Contact Admin</span></p>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
