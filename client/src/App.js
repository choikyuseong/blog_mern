import React , {Component} from 'react';
import { BrowserRouter as Router , Route } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser , logoutUser } from "./action/authAction";


import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';


import './App.css';


// check for token
if (localStorage.jwtToken) {
    //set auth token header auth
    setAuthToken(localStorage.jwtToken);

    //decode token and get user info and exp
    const decoded = jwt_decode(localStorage.jwtToken);

    //set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    //check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime){
        //logout user
        store.dispatch(logoutUser());

        //todo: clear current profile

        //redirect to login
        window.location.href = '/login';

    }
}





function App() {
  return (

      <Provider store={store}>
      <Router>
        <div className="App">
            <Navbar/>
            <Route exact path="/" component={Landing} />

            <div className="container">
                <Route exact path="/Register" component={Register} />
                <Route exact path="/Login" component={Login} />
            </div>

            <Footer/>



        </div>
      </Router>
      </Provider>
  );
}

export default App;
