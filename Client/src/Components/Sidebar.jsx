import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiViewGridAdd } from "react-icons/hi";
import { HiPencilAlt } from "react-icons/hi";
import { HiOutlineDownload } from "react-icons/hi";
import { HiOutlineInboxIn } from "react-icons/hi";

const Sidebar = () => {
  const baseStyle = 'py-3 px-4 rounded text-gray-700 text-center flex items-center space-x-2 justify-between font-semibold';
  const activeStyle = 'bg-blue-500 text-white hover:bg-blue-400 font-bold';

  return (
    <div className="w-[15%] h-full flex items-start justify-center bg-white py-20 border-r border-gray-400">
      <div className="flex flex-col space-y-10 w-[80%]">
        {/* New Entry - Uses 'end' to match exactly "/new-entry" */}
        <NavLink
          to="/new-entry"
          end  
          className={({ isActive }) => (isActive ? `${activeStyle} ${baseStyle}` : baseStyle)}
        >
          New Entry
          <HiViewGridAdd size={20}/>
        </NavLink>

        <NavLink
          to="/new-entry/edit-student"
          className={({ isActive }) => (isActive ? `${activeStyle} ${baseStyle}` : baseStyle)}
        >
          Edit Student
          <HiPencilAlt size={20}/>
        </NavLink>

        <NavLink
          to="/new-entry/download-report"
          className={({ isActive }) => (isActive ? `${activeStyle} ${baseStyle}` : baseStyle)}
        >
          Download Report
          <HiOutlineDownload size={20}/>
        </NavLink>

        <NavLink
          to="/new-entry/final-summary"
          className={({ isActive }) => (isActive ? `${activeStyle} ${baseStyle}` : baseStyle)}
        >
          Final Summary
          <HiOutlineInboxIn size={20}/>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
