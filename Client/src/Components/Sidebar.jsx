import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HiViewGridAdd } from "react-icons/hi";
import { HiPencilAlt } from "react-icons/hi";
import { HiOutlineDownload } from "react-icons/hi";
import { HiOutlineInboxIn } from "react-icons/hi";
const Sidebar = () => {
  const location = useLocation();
  const baseStyle = 'py-3 px-4 rounded text-gray-700 text-center flex items-center space-x-2 justify-between font-semibold';
  const activeStyle = 'bg-blue-500 text-white hover:bg-blue-400 font-bold';

  return (
    <div className="w-[15%] h-full flex items-start justify-center bg-white py-20 border-r border-gray-400">
      <div className="flex flex-col space-y-10 w-[80%]">
        <NavLink
          to="/new-entry"
          className={({ isActive }) =>
            isActive || location.pathname === '/' ? `${activeStyle} ${baseStyle}` : baseStyle
          }
        >
          New Entry
          <HiViewGridAdd size={20}/>
        </NavLink>
        <NavLink
          to="/edit-student"
          className={({ isActive }) => (isActive ? `${baseStyle} ${activeStyle}` : baseStyle)}
        >
          Edit Student
          <HiPencilAlt size={20}/>
        </NavLink>
        <NavLink
          to="/download-report"
          className={({ isActive }) => (isActive ? `${baseStyle} ${activeStyle}` : baseStyle)}
        >
          Download Report
          <HiOutlineDownload size={20}/>
        </NavLink>
        <NavLink
          to="/final-summary"
          className={({ isActive }) => (isActive ? `${baseStyle} ${activeStyle}` : baseStyle)}
        >
          Final Summary
          <HiOutlineInboxIn size={20}/>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
