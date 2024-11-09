import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Header from './components/Header'; 
import Homepage from './components/Homepage';
import Footer from './components/Footer';
import Login from './components/Login';
import Feedboard from './components/Feedboard';
import Feedback from './components/Feedback';
import ResumeEditor from './components/ResumeEditor';

import './stylesheets/header.css';
import './stylesheets/global.css'; 
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feedboard" element={<Feedboard />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/resume-editor" element={<ResumeEditor />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;