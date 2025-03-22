import React from 'react'
import {getInitials} from '../Utils/utils'
import { BiLogOutCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
const Header = ({user}) => {
    const navigate = useNavigate();
    const handlelogout = () => () => {
        localStorage.clear();
        navigate('/')};
    const name = user
  return (
    <>
        <header className='h-[80px] w-full bg-white flex items-center justify-between px-10 shadow-lg border-b border-gray-300'>
            <div className='text-3xl font-bold'>
                <h1 className='text-black'>KG<span className='text-blue-500'>CAR</span> </h1>
            </div>
            <div className='flex items-center gap-5 text-lg'>
                <h3>
                    <span className='mx-2 font-bold'>
                      User:   
                    </span>
                     {name}
                </h3>    
                <div className='w-[50px] h-[50px] rounded-full border-2 border-blue-400 flex items-center justify-center'>
                    <h3 className='font-bold'>
                        {getInitials(name)}
                    </h3>
                </div>
                <div className='flex items-center gap-2 font-bold cursor-pointer'onClick={handlelogout()}>
                    Logout
                    <BiLogOutCircle size={20}/>
                </div>
                
            </div>            
        </header>
    </>
  )
}

export default Header