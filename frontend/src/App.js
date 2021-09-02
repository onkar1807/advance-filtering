import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import BootcampsPage from './pages/BootcampsPage'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={BootcampsPage}/>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
