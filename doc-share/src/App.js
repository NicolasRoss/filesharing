import React from 'react';
import './css/App.css';
import DocCardContainer from './components/docCardContainer';
import Navbar from './components/navbar';
import WelcomeCard from './components/welcomeCard';
import SignUpCard from './components/signUpCard'

function App() {
  return (
    <div>
      <Navbar/>
      <DocCardContainer/>
      <WelcomeCard/>
      <SignUpCard/>
    </div>
    
  );
}

export default App;
