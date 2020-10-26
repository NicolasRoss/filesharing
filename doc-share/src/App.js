import React from 'react';
import './css/App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Share from './pages/Share';
import Account from './pages/Account';
import DocViewer from './pages/DocViewer';
import {Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Switch>
      <Route path="/" exact component={Home}/>
      <Route path="/Login" component={Login}/>
      <Route path="/Share" component={Share}/>
      <Route path="/Account" component={Account}/>
      <Route path="/DocViewer" component={DocViewer}/>
    </Switch>
  );
}

export default App;
