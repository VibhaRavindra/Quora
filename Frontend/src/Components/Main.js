import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import Header from './Navigation/Header';
import Home from './Home/Home';
// import '../App.css';
import SignUp from './Account/SignUp';
import ChooseTopics from './Account/ChooseTopics';

class Main extends Component {
  render() {
    if("jwtToken" in localStorage) {
      return (
        <div>
          <Route path = "/header" component = {Header} />
          <Route path = "/signup" component = {SignUp} />
          <Route path = "/quora/topics" component = {ChooseTopics} />
          <Route exact path="/home" component={Home}/>
        </div>
      );
    } else {
      return(
        <div>
          <Route path = "/quora" component = {SignUp} />
        </div>
      )
    }
  }
}

export default Main;
