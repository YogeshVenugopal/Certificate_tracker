import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPagination from 'react-paginate';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Table = ({ type, studentData }) => {
  const navigate = useNavigate();
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    if (studentData && studentData.data) {
      const endOffset = Math.min(itemOffset + itemsPerPage, studentData.data.length);
      setCurrentItems(studentData.data.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(studentData.data.length / itemsPerPage));
    }
  }, [itemOffset, studentData]);
 const editUrl = (student_id,version) => {
   const currentUrl = window.location.pathname;
   return currentUrl.replace('/edit-student', `/edit/${student_id}/${version}`);
 }
  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage;
    setItemOffset(newOffset);
  };

  return (
    <>
      {currentItems.length > 0 ? (
        <>
          <table className='w-full rounded-sm'>
            <thead className='w-full font-semibold text-white bg-gray-700'>
              <tr className='text-lg h-[50px] rounded'>
                <th className='w-[10%] text-center'>S.No</th>
                <th className='w-[30%] text-center'>Student Name</th>
                <th className='w-[20%] text-center'>Admission No.</th>
                <th className='w-[10%] text-center'>Department</th>
                <th className='w-[10%] text-center'>Studies</th>
                <th className='w-[10%] text-center'>Version</th>
                <th className='w-[10%] text-center'>Action</th>
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
                      className='text-blue-500 underline cursor-pointer underline-offset-2 hover:text-blue-700'
                      onClick={() => 
                        type === "Edit" ? navigate(`${editUrl(student.admission_no, student.version)}`) : console.log("Download")}
                    >
                      {type}
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
