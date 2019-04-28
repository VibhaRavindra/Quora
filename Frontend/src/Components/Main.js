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
import displayprofile from './Profile/displayprofile';
import Topic from './Topic/Topic';

class Main extends Component {
  render() {
    if (localStorage.getItem("jwtToken")!== null) {
      return (
        <div>
          <Route path="/header" component={Header} />
          <Route path="/signup" component={SignUp} />
          <Route path="/quora/topics" component={ChooseTopics} />
          <Route path="/answer/question/:questionId" component={QuestionAnswers} />
          <Route path="/answer/create" component={AnswerForm} />
          <Route exact path="/quora/home" component={Home} />
          <Route exact path="/quora/topic/:topicName" component={Topic} />
              <Route path="/quora/myprofile" component={Profile} />
         <Route path = "/quora/profile/:user_id" component = {displayprofile} />
          <Route exact path="/quora/SeeAllNotifications" component={SeeAllNotifications} />
        </div>
    );
    } else {
      return (
        <div>
          <Route path="/" component={SignUp} />
        </div>
     )
    }
  }
}

export default Main;