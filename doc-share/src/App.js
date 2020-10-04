import React from 'react';
import './css/App.css';
import DocCardContainer from './components/docCardContainer';
import Navbar from './components/navbar';
import WelcomeCard from './components/welcomeCard';
import Login from './pages/Login';
import Home from './pages/Home';
import Document from './pages/Document';
import {Route, Link, Switch } from 'react-router-dom';
function App() {
  return (
    <Switch>
      <Route path="/" exact component={Home}/>
      <Route path="/Login" component={Login}/>
      <Route path="/Document" component={Document}/>

    </Switch>
  );
}

export default App;
