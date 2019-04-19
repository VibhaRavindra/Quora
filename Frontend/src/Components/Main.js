import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import Header from './Navigation/Header';
import SignUp from './Account/SignUp';

class Main extends Component {
  render() {
    return (
      <div>
        <Route path = "/header" component = {Header} />
        <Route path = "/signup" component = {SignUp} />
      </div>
    );
  }
}

export default Main;
