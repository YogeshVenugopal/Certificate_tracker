import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const baseStyle = 'block text-left py-2 px-4 rounded text-gray-700 hover:bg-gray-100';
  const activeStyle = 'bg-gray-200 font-bold';

  return (
    <div className="w-[15%] h-full flex items-start justify-center bg-white py-20">
      <div className="flex flex-col space-y-10">
        <NavLink
          to="/new-entry"
          className={({ isActive }) => (isActive ? `${baseStyle} ${activeStyle}` : baseStyle)}
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
