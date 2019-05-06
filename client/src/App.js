import React , {Component} from 'react';
import { BrowserRouter as Router , Route } from "react-router-dom";

import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Landing from "./components/layout/Landing";
import Login from './components/auth/Login';
import Register from './components/auth/Register';


import './App.css';


function App() {
  return (
      
      <Router>
        <div className="App">
            <Navbar/>
            <Router exact path="/" component={Landing} />
            <div >
                <Router exact path="/Register" component={Register} />
                <Router exact path="/Login" component={Login} />
            </div>

            <Footer/>



        </div>
      </Router>
  );
}

export default App;
