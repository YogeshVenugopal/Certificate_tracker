import React from 'react'
import { PiMagnifyingGlassBold } from "react-icons/pi";
const SearchBar = () => {
  return (
    <div className='flex items-center justify-end w-full h-auto gap-3 px-5 rounded-lg'>
        <input className='w-[20%] h-[50px] outline-none border border-gray-300 rounded-lg px-3' type="text" placeholder='Search Admission Number...' />
        <button className='flex items-center justify-center gap-2 p-3 font-semibold text-white bg-blue-500 rounded-lg'>
            Search
            <PiMagnifyingGlassBold size={20}/>
        </button>
    </div>
  )
}

export default SearchBar