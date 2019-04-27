import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Header from './Navigation/Header';
import Home from './Home/Home';
import QuestionAnswers from './Answers/QuestionAnswers';
import AnswerForm from './Answers/AnswerForm';
// import '../App.css';
import SignUp from './Account/SignUp';
import ChooseTopics from './Account/ChooseTopics';
import SeeAllNotifications from './Notifications/SeeAllNotifications';
import Profile from './Profile/Profile';
import displayprofile from './Profile/displayprofile'
class Main extends Component {
  render() {
   
      return (
        <div>
          <Route path="/header" component={Header} />
          <Route path="/signup" component={SignUp} />
          <Route path="/quora/topics" component={ChooseTopics} />
          <Route path="/answer/question/:questionId" component={QuestionAnswers} />
          <Route path="/answer/create" component={AnswerForm} />
          <Route exact path="/quora/home" component={Home} />
          <Route path="/profile" component={Profile} />
         <Route path = "/displayprofile" component = {displayprofile} />
          <Route exact path="/SeeAllNotifications" component={SeeAllNotifications} />
        </div>
     );
    
  
}}

export default Main;
