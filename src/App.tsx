import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header'; 
import Homepage from './components/Homepage';
import Footer from './components/Footer';
import Login from './components/Login';
import Feedboard from './components/Feedboard';
import Feedback from './components/Feedback';
import ResumeEditor from './components/ResumeEditor';
import { getResumes } from './api';

import './stylesheets/header.css';
import './stylesheets/global.css'; 
import './App.css';

function App() {
  const [resumes, setResumes] = useState([]);
  
  useEffect(() => {
    const fetchResumes = async () => {
      const resumeData = await getResumes();
      setResumes(resumeData);
    };
    
    fetchResumes();
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feedboard" element={<Feedboard resumes ={resumes}/>} />
        <Route path="/feedback/:resumeId" element={<Feedback />} />
        <Route path="/resume-editor" element={<ResumeEditor />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;