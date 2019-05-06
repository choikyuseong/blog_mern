import React , {Component} from 'react';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Landing from "./components/layout/Landing";

import './App.css';


function App() {
  return (
    <div className="App">

        <Navbar/>
        <Landing/>
        <Footer/>


    </div>
  );
}

export default App;
