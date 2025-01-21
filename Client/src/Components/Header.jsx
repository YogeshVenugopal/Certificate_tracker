import React from 'react'
import getInitials from '../Utils/utils'
const Header = () => {
    const name = "Sample Name"
  return (
    <>
        <header className='h-[80px] w-full bg-white flex items-center justify-between px-10 '>
            <div className='text-3xl font-bold'>
                <h1 className='text-black'>KG<span className='text-blue-500'>CAR</span> </h1>
            </div>
            <div className='flex items-center space-x-5'>
                <h1>
                    <span className='mx-2 font-bold'>
                      User:   
                    </span>
                     {name}
                </h1>    
                <div className='w-[50px] h-[50px] rounded-full border-2 border-blue-400 flex items-center justify-center'>
                    <h1 className='font-bold'>
                        {getInitials(name)}
                    </h1>
                </div>
                
            </div>            
        </header>
    </>
  )
}

export default Header