import React, { useEffect, useState } from 'react'
import SearchBar from '../Components/SearchBar'
import Table from '../Components/Table'
import { motion } from 'framer-motion';
import { API_CALL } from '../Utils/utils';

const EditStudent = () => {
  const [student, setStudent] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const responseData = await fetch(`${API_CALL}/get-student`, {
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
      else {
        showError('Failed to fetch student data');
      }
    } catch (error) {
      console.log(error);
      showError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = async (admissionNumber) => {
    if (!admissionNumber.trim()) {
      fetchAllStudents();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_CALL}/search-student/${admissionNumber}/unlock`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();

        if (data.length === 0) {
          showError('No student found with that admission number');
        } else {
          setStudent(data);
        }
      } else {
        showError('Failed to search for student');
      }
    } catch (error) {
      console.log(error);
      showError('An error occurred while searching');
    } finally {
      setLoading(false);
    }
  }

  const showError = (message) => {
    setError(message);
    setInterval(() => {
      setError(null);
    }, 3000);
  }

  return (
    <div className='py-5'>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute px-3 py-3 font-bold text-red-500 border-2 bg-red-100 border-red-500 rounded top-2 right-[45%] text-lg transform -translate-x-1/2"
        >
          {error}
        </motion.div>
      )}
      <SearchBar onSearch={handleSearch} />
      <div className='mt-10 w-[90%] h-auto p-5 rounded-md mx-auto shadow-[rgba(50,50,93,0.25)_0px_2px_12px_-2px,_rgba(0,0,0,0.3)_0px_0px_7px_-3px]'>
        <h1 className='mb-10 text-4xl font-bold text-gray-500'>Students List</h1>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        ) : (
          <Table type='View' studentData={student} />
        )}
      </div>
    </div>
  )
}

export default EditStudent