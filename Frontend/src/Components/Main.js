import React, { Component } from 'react';
import {Route} from 'react-router-dom';
// import SignIn from './Components/SignIn';
// import SignUp from './Components/SignUp';
import Header from './Navigation/Header';
// import '../App.css';

class Main extends Component {
  render() {
    return (
      <div>
        <Route path = "/header" component = {Header} />
      </div>
    );
  }
}

export default Main;
