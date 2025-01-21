import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NewEntry from './Pages/NewEntry'
function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<NewEntry />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
