import React, { useEffect, useState } from 'react'
import SearchBar from '../Components/SearchBar'
import Table from '../Components/Table'
import studentData from '../MockData/sampleData.json';
import { motion } from 'framer-motion';

const EditStudent = () => {

  const [student, setStudent] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const responseData = await fetch('http://localhost:3000/get-student', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (responseData.ok) {
          const data = await responseData.json();
          console.log(data);
          setStudent(data);
        }
        else{
          setError('Failed to fetch student data');
          setInterval(() => {
            setError(null);
          }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchStudentData();
  },[])

  return (
    <div className='py-5'>
      {error && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute px-3 py-3 font-bold text-red-500 bg-white border-l-2 border-red-500 rounded top-2 right-5"
        >
          {error}
        </motion.div>
      )}
      <SearchBar />
      <div className='mt-10 w-[90%] h-auto p-5 rounded-md mx-auto shadow-[rgba(50,50,93,0.25)_0px_2px_12px_-2px,_rgba(0,0,0,0.3)_0px_0px_7px_-3px]'>        {/* Don't forget to change the height value */}
        <h1 className='mb-10 text-4xl font-bold text-gray-500'>Students List</h1>
        <Table type='Edit' studentData={student} />
      </div>
    </div>
  )
}

export default EditStudent