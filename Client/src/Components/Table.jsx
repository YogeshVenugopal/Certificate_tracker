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
    if (studentData && studentData.studentsdata) {
      const endOffset = Math.min(itemOffset + itemsPerPage, studentData.studentsdata.length);
      setCurrentItems(studentData.studentsdata.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(studentData.studentsdata.length / itemsPerPage));
    }
  }, [itemOffset, studentData]);

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage;
    setItemOffset(newOffset);
  };

  return (
    <>
      <table className='w-full rounded-sm'>
        <thead className='w-full font-semibold text-white bg-gray-700'>
          <tr className='text-lg h-[50px] rounded'>
            <th className='w-[10%] text-center'>S.No</th>
            <th className='w-[30%] text-center'>Student Name</th>
            <th className='w-[20%] text-center'>Admission No.</th>
            <th className='w-[15%] text-center'>Department</th>
            <th className='w-[15-%] text-center'>Studies</th>
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
              <td>
                <h3
                  className='text-blue-500 underline cursor-pointer underline-offset-2 hover:text-blue-700'
                  onClick={() => 
                    type === "Edit"? navigate(`/edit/${student.admission_no}`) : console.log("Download")}
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
  );
};

export default Table;
