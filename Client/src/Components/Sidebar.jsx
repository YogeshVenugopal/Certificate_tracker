import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const baseStyle = 'py-3 px-4 rounded text-gray-700 text-center';
  const activeStyle = 'bg-blue-500 text-white hover:bg-blue-400 font-bold shadow-md';

  return (
    <div className="w-[15%] h-full flex items-start justify-center bg-white py-20">
      <div className="flex flex-col space-y-10 w-[80%]">
        <NavLink
          to="/new-entry"
          className={({ isActive }) => (isActive ? `${activeStyle} ${baseStyle} ` : baseStyle)}
        >
          New Entry
        </NavLink>
        <NavLink
          to="/edit-student"
          className={({ isActive }) => (isActive ? `${baseStyle} ${activeStyle}` : baseStyle)}
        >
          Edit Student
        </NavLink>
        <NavLink
          to="/download-report"
          className={({ isActive }) => (isActive ? `${baseStyle} ${activeStyle}` : baseStyle)}
        >
          Download Report
        </NavLink>
        <NavLink
          to="/final-summary"
          className={({ isActive }) => (isActive ? `${baseStyle} ${activeStyle}` : baseStyle)}
        >
          Final Summary
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
