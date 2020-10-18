import React from 'react';
import './css/App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Document from './pages/Document';
import Share from './pages/Share';
import Account from './pages/Account';
import {Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Switch>
      <Route path="/" exact component={Home}/>
      <Route path="/Login" component={Login}/>
      <Route path="/Document" component={Document}/>
      <Route path="/Share" component={Share}/>
      <Route path="/Account" component={Account}/>
    </Switch>
  );
}

export default App;
