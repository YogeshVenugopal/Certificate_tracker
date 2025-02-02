import React, { useEffect, useState } from 'react';
import { RxCross2 } from "react-icons/rx";
const MessageBox = ({ message, status, duration = 3000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    return (
        <div className={`fixed top-5 left-1/2 bg-white transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg flex items-center justify-between w-[350px] border-l
            ${status === 'success' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500' }
            transition-all duration-300 ease-in-out`}>
            <p className="text-sm font-semibold">{message}</p>
            <button onClick={() => setVisible(false)} className="ml-4 focus:outline-none">
                <RxCross2 size={18} className="transition-opacity opacity-80 hover:opacity-100" />
            </button>
        </div>
    );
};

export default MessageBox;
