import React, { Component } from 'react';
import {Route} from 'react-router-dom';
// import SignIn from './Components/SignIn';
// import SignUp from './Components/SignUp';
import Header from './Navigation/Header';
import Home from './Home/Home';
// import '../App.css';

class Main extends Component {
  render() {
    return (
      <div>
        <Route exact path="/home" component={Home}/>
        <Route path = "/header" component = {Header} />
        
      </div>
    );
  }
}

export default Main;
