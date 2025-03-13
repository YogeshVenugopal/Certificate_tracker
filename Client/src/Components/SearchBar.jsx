import React from 'react'
import { PiMagnifyingGlassBold } from "react-icons/pi";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  }

  return (
    <form onSubmit={handleSubmit} className='flex items-center justify-end w-full h-auto gap-3 px-5 rounded-lg'>
        <input 
          className='w-[20%] h-[50px] outline-none border border-gray-300 rounded-lg px-3' 
          type="text" 
          placeholder='Search Admission Number...' 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          type="submit"
          className='flex items-center justify-center gap-2 p-3 font-semibold text-white bg-blue-500 rounded-lg'
        >
            Search
            <PiMagnifyingGlassBold size={20}/>
        </button>
    </form>
  )
}

export default SearchBar