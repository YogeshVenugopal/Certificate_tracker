import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPagination from 'react-paginate';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { API_CALL } from '../Utils/utils';

const Table = ({ type, studentData }) => {
  const navigate = useNavigate();
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [sucess, setSucess] = useState('');
  const [error, setError] = useState('');
  const [itemOffset, setItemOffset] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    if (studentData && studentData.data) {
      const endOffset = Math.min(itemOffset + itemsPerPage, studentData.data.length);
      setCurrentItems(studentData.data.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(studentData.data.length / itemsPerPage));
    }
  }, [itemOffset, studentData]);

  const editUrl = (student_id, version) => {
    const currentUrl = window.location.pathname;
    return currentUrl.replace('/edit-student', `/edit/${student_id}/${version}`);
  };

  const handleDownload = async (admissionNo, version) => {
    setDownloading(true);
    try {
      // Construct the PDF URL
      const pdfUrl = `${API_CALL}/pdfDownloader/${admissionNo}/${version}?preview=true`;
      
      console.log('Attempting to open PDF at URL:', pdfUrl);
      
      // Open the PDF in a new tab
      window.open(pdfUrl, '_blank');
      
      console.log('PDF preview request sent');
    } catch (error) {
      console.error('Error details:', error);
      setError('An error occurred while downloading the student data.');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setDownloading(false);
      setError('');
      setSucess('');
    }
  };

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage;
    setItemOffset(newOffset);
  };

  return (
    <>
      {currentItems.length > 0 ? (
        <>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute px-3 py-3 font-bold text-red-500 bg-white border-l-2 border-red-500 rounded top-2 right-5"
            >
              {error}
            </motion.div>
          )}
          {sucess && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute px-3 py-3 font-bold text-green-500 bg-green-100 border-2 border-green-500 rounded top-2 right-[45%] text-lg transform -translate-x-1/2"
            >
              {sucess}
            </motion.div>
          )}
          <table className='w-full rounded-sm'>
            <thead className='w-full font-semibold text-white bg-gray-700'>
              <tr className='text-lg h-[50px] rounded'>
                <th className='w-[10%] text-center'>S.NO</th>
                <th className='w-[30%] text-center'>STUDENT NAME</th>
                <th className='w-[20%] text-center'>ADMISSION NO.</th>
                <th className='w-[10%] text-center'>DEPARTMENT</th>
                <th className='w-[10%] text-center'>PROGRAM</th>
                <th className='w-[10%] text-center'>VERSION</th>
                <th className='w-[10%] text-center'>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((student, index) => (
                <tr key={student.id} className='text-center h-[50px] bg-gray-50 even:bg-gray-100'>
                  <td>{itemOffset + index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.admission_no}</td>
                  <td>{student.department}</td>
                  <td>{student.studies}</td>
                  <td>{student.version}</td>
                  <td>
                    <h3
                      className={`underline cursor-pointer underline-offset-2 ${downloading ? 'text-gray-400' : 'text-blue-500 hover:text-blue-700'}`}
                      onClick={() =>
                        type === "View"
                          ? navigate(`${editUrl(student.admission_no, student.version)}`)
                          : handleDownload(student.admission_no, student.version)
                      }
                    >
                      {downloading && type === "Download" ? "Loading..." : type}
                    </h3>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReactPagination
            breakLabel="..."
            nextLabel={<IoIosArrowForward />}
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            pageCount={pageCount}
            previousLabel={<IoIosArrowBack />}
            marginPagesDisplayed={4}
            renderOnZeroPageCount={null}
            containerClassName='pagination'
            pageLinkClassName='page-num'
            previousLinkClassName='page-num'
            nextLinkClassName='page-num'
            activeLinkClassName='active'
          />
        </>
      ) : (
        <div className="mt-5 text-lg font-semibold text-center text-gray-500">
          No student data has been fetched.
        </div>
      )}
    </>
  );
};

export default Table;