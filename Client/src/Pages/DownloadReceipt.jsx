import React from 'react'
import SearchBar from '../Components/SearchBar'
import Table from '../Components/Table'
import studentData from '../MockData/sampleData.json';
const DownloadReceipt = () => {
  return (
    <div className='py-5'>
      <SearchBar/>
      <div className='mt-10 w-[90%] h-auto p-5 rounded-md mx-auto shadow-[rgba(50,50,93,0.25)_0px_2px_12px_-2px,_rgba(0,0,0,0.3)_0px_0px_7px_-3px]'>
        <h1 className='mb-10 text-4xl font-bold text-gray-500'>Download Receipt</h1>
        <Table type='Download' studentData={studentData}></Table>
      </div>
    </div>
  )
}

export default DownloadReceipt