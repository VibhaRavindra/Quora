import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import Header from './Navigation/Header';
import SignUp from './Account/SignUp';
import ChooseTopics from './Account/ChooseTopics';

class Main extends Component {
  render() {
    return (
      <div>
        <Route path = "/header" component = {Header} />
        <Route path = "/signup" component = {SignUp} />
        <Route path = "/topics" component = {ChooseTopics} />
      </div>
    );
  }
}

export default Main;
