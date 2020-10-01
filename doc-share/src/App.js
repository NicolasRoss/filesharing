import React from 'react';
import './css/App.css';
import DocumentCard from './components/documentCard';
import DocCardContainer from './components/docCardContainer'
import Navbar from './components/navbar';
function App() {
  return (
    <div>
      <Navbar/>
      <DocCardContainer/>
    </div>
    
  );
}

export default App;
