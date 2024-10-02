import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Header from './components/Header'; 
import Homepage from "./components/Homepage"
import Footer from "./components/Footer"
import './stylesheets/header.css';
import './stylesheets/global.css'; 
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <>
        <Dashboard />
      </>
      <Header /> 
      <main>
        <Homepage />
      </main>
      <Footer />
    </div>
    
  )
}

export default App
