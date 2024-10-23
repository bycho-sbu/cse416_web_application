import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Header from './components/Header'; 
import Homepage from "./components/Homepage";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Feedboard from "./components/Feedboard"

import './stylesheets/header.css';
import './stylesheets/global.css'; 
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <>
        <Header />
        <Dashboard />
      </>
      <>
        <Login />
      </>
      <Header /> 
      <>
        <Homepage />
      </>
      <Footer />
      <>
      <Header />
      <Feedboard />
      </>
    </div>
    
    
  )
}

export default App
