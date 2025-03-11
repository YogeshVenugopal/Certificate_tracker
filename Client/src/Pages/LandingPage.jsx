import React from 'react';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import { Outlet } from 'react-router-dom';

const LandingPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="w-full h-screen">

      <Header user={user} />

      <div className="flex w-full h-auto">
        <Sidebar />
        <div className="flex-1 h-auto min-h-[calc(100vh-80px)] bg-white border-l border-gray-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
