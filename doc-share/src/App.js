import React from 'react';
import logo from './logo.svg';
import './App.css';
import DocumentCard from './components/documentCard';
import DocCardContainer from './components/docCardContainer'
import Navbar from './components/navbar';
import WelcomeCard from './components/welcomeCard';
function App() {
  return (
    <div>
      <Navbar/>
      <DocCardContainer/>
      <WelcomeCard/>
    </div>
    
  );
}

export default App;
