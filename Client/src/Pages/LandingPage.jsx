import React from 'react';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import { Outlet } from 'react-router-dom';

const LandingPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="bg-[#E5E5E5] w-full h-screen">
      {/* Header */}
      <Header user={user}/>

      {/* Sidebar and Main Content */}
      <div className="flex w-full h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Dynamic Content */}
        <div className="flex-1 h-full bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
