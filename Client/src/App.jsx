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
        <Route path='login' element={<Login />} />
        <Route path="/" element={<LandingPage />}>
          <Route index element={<NewEntry />} />
          <Route path="new-entry" element={<NewEntry />} />
          <Route path="edit-student" element={<EditStudent />} />
          <Route path="download-report" element={<DownloadReceipt />} />
          <Route path="final-summary" element={<FinalSummary />} />
          <Route path='edit/:id' element={<EditFile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
