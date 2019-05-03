import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Header from './Navigation/Header';
import Home from './Home/Home';
import Bookmarks from './Bookmarks/Bookmarks';
import QuestionAnswers from './Answers/QuestionAnswers';
// import '../App.css';
import SignUp from './Account/SignUp';
import ChooseTopics from './Account/ChooseTopics';
import SeeAllNotifications from './Notifications/SeeAllNotifications';
import Profile from './Profile/Profile';
import displayprofile from './Profile/displayprofile';
import Topic from './Topic/Topic';
import Messages from './Messages/Messages';
import upvotegraph from './Graph/upvotegraph';
import downvotegraph from './Graph/downvotegraph';
import answerviewsgraph from './Graph/answerviewsgraph';
import AnalyticsDashboard from './Graph/AnalyticsDashboard';

class Main extends Component {
  render() {
    if (localStorage.getItem("jwtToken")!== null) {
      return (
        <div>
          <Route path="/header" component={Header} />
          <Route path="/signup" component={SignUp} />
          <Route path="/quora/topics" component={ChooseTopics} />
          <Route path="/quora/question/:questionId" component={QuestionAnswers} />
          <Route exact path="/quora/home" component={Home} />
          <Route exact path="/quora/bookmarks" component={Bookmarks} />
          <Route exact path="/quora/topic/:topicName" component={Topic} />
              <Route path="/quora/myprofile" component={Profile} />
         <Route path = "/quora/profile/:user_id" component = {displayprofile} />
          <Route exact path="/quora/SeeAllNotifications" component={SeeAllNotifications} />
          <Route exact path="/quora/messages" component={Messages} />
          <Route path="/quora/AnalyticsDashboard" component={AnalyticsDashboard} />
              <Route path="/quora/upvotegraph" component={upvotegraph} />
              <Route path="/quora/downvotegraph" component={downvotegraph} />
              <Route path="/quora/answerviewsgraph" component={answerviewsgraph} />
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