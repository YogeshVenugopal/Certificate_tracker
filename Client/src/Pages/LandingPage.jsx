import React from 'react';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import { Outlet } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-[#E5E5E5] w-full h-screen">
      {/* Header */}
      <Header />

      {/* Sidebar and Main Content */}
      <div className="flex w-full h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Dynamic Content */}
        <div className="flex-1 h-full bg-white border border-red-500">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
