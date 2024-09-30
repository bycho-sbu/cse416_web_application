import React from 'react';
import Header from './components/Header'; 
import Homepage from "./components/Homepage"
import Footer from "./components/Footer"
import './stylesheets/header.css';
import './stylesheets/global.css'; 


function App() {
  return (
    <div>
      <Header /> 
      <main>
        <Homepage />
      </main>
      <Footer />
    </div>
  );
}

export default App;
