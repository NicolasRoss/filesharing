import React from 'react';
import './css/App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Document from './pages/Document';
import {Route, Switch } from 'react-router-dom';
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
