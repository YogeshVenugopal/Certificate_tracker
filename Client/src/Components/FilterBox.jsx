import React, { useState } from 'react';
import { API_CALL } from '../Utils/utils';

const FilterBox = () => {
  // State for form inputs
  const [filters, setFilters] = useState({
    remarks: 'yes', // Default to 'yes'
    categories: 'UG' // Default to 'ALL'
  });

  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  // State for error handling
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Call the backend API using fetch
      const response = await fetch(`${API_CALL}/generateExcel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          remarks: filters.remarks.toLowerCase(),
          categories: filters.categories
        })
      });
      console.log(filters.remarks.toLowerCase(), filters.categories);

      if (response.ok) {
        const blob = await response.blob();

        // Create a download link for the Excel file
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'student-report.xlsx');
        document.body.appendChild(link);
        link.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        link.remove();


      } else {

        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Get blob from response

    } catch (err) {
      setError('Failed to generate report. Please try again.');
      console.error('Error downloading report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='flex items-center justify-center w-full h-auto mt-10'>
          <div className='w-[90%] h-auto flex items-center justify-center flex-wrap gap-8'>
            <div className='flex flex-col'>
              <label htmlFor="remarks" className="block mb-1 font-bold text-gray-700">With remark:</label>
              <select
                className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                name="remarks"
                id="remarks"
                value={filters.remarks}
                onChange={handleChange}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="categories" className="block mb-1 font-bold text-gray-700">Category:</label>
              <select
                className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                name="categories"
                id="categories"
                value={filters.categories}
                onChange={handleChange}
              >
                <option value="UG">UG - Regular</option>
                <option value="PG_MBA">PG-MBA</option>
                <option value="PG_ME">PG-ME</option>
                <option value="LATERAL">UG - LATERAL</option>
              </select>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center w-full'>
          {error && (
            <div className="mb-4 font-medium text-red-600">{error}</div>
          )}
          <button
            type="submit"
            className={`w-[50%] h-[50px] ${isLoading ? 'bg-blue-300' : 'bg-blue-500'} text-white font-semibold rounded-lg mt-10 flex items-center justify-center`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Download Files'
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default FilterBox;