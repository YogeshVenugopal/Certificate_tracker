import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import NewEntry from './Pages/NewEntry';
import EditStudent from './Pages/EditStudent';
import DownloadReceipt from './Pages/DownloadReceipt';
import FinalSummary from './Pages/FinalSummary';
import EditFile from './Pages/EditFile';
import Login from './Pages/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path='/' element={<Login />} />
        
        {/* Nested Routes under LandingPage */}
        <Route path="/new-entry" element={<LandingPage />}>
          <Route index element={<NewEntry />} />
          <Route path="edit-student" element={<EditStudent />} />
          <Route path="download-report" element={<DownloadReceipt />} />
          <Route path="final-summary" element={<FinalSummary />} />
          <Route path="edit/:id/:version" element={<EditFile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
