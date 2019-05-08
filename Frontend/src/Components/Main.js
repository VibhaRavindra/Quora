import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Header from './Navigation/Header';
import Home from './Home/Home';
import Bookmarks from './Bookmarks/Bookmarks';
import QuestionAnswers from './Answers/QuestionAnswers';
import AnswerForm from './Answers/AnswerForm';
import SignUp from './Account/SignUp';
import ChooseTopics from './Account/ChooseTopics';
import SeeAllNotifications from './Notifications/SeeAllNotifications';
import Profile from './Profile/Profile';
import displayprofile from './Profile/displayprofile';
import Topic from './Topic/Topic';
import SearchQuestions from './Search/SearchQuestions';
import SearchProfiles from './Search/SearchProfiles';
import SearchTopics from './Search/SearchTopics';
import QuestionsAsked from './Content/QuestionsAsked';
import QuestionsFollowed from './Content/QuestionsFollowed';
import QuestionsAnswered from './Content/QuestionsAnswered';
import SingleQuestionAnswer from './Answers/SingleQuestionAnswer';
import upvotegraph from './Graph/upvotegraph';
import downvotegraph from './Graph/downvotegraph';
import answerviewsgraph from './Graph/answerviewsgraph';
import AnalyticsDashboard from './Graph/AnalyticsDashboard';
import profileviewsgraph from './Graph/profilegraph';
import bookmarksgraph from './Graph/bookmarksgraph';

class Main extends Component {
  render() {
    if (localStorage.getItem("jwtToken")!== null) {
      return (
        <div>
          <Route path="/header" component={Header} />
          <Route path="/signup" component={SignUp} />
          <Route path="/quora/topics" component={ChooseTopics} />
          <Route exact path="/quora/question/:questionId" component={QuestionAnswers} />
          <Route path="/quora/question/:questionId/:answerId" component={SingleQuestionAnswer} />
          <Route exact path="/quora/home" component={Home} />
          <Route exact path="/quora/bookmarks" component={Bookmarks} />
          <Route exact path="/quora/topic/:topicName" component={Topic} />
          <Route path="/quora/myprofile" component={Profile} />
          <Route path = "/quora/profile/:user_id" component = {displayprofile} />
          <Route exact path="/quora/SeeAllNotifications" component={SeeAllNotifications} />
          <Route exact path="/quora/search/questions/:searchValue" component={SearchQuestions} />
          <Route exact path="/quora/search/profiles/:searchValue" component={SearchProfiles} />
          <Route exact path="/quora/search/topics/:searchValue" component={SearchTopics} />
          <Route exact path="/quora/content/questions_asked" component={QuestionsAsked} />
          <Route exact path="/quora/content/questions_asked/:year" component={QuestionsAsked} />
          <Route exact path="/quora/content/questions_asked/:year/:sortorder" component={QuestionsAsked} />
          <Route exact path="/quora/content/questions_followed" component={QuestionsFollowed} />
          <Route exact path="/quora/content/questions_followed/:year" component={QuestionsFollowed} />
          <Route exact path="/quora/content/questions_followed/:year/:sortorder" component={QuestionsFollowed} />
          <Route exact path="/quora/content/questions_answered" component={QuestionsAnswered} />
          <Route exact path="/quora/content/questions_answered/:year" component={QuestionsAnswered} />
          <Route exact path="/quora/content/questions_answered/:year/:sortorder" component={QuestionsAnswered} />
          <Route path="/quora/AnalyticsDashboard" component={AnalyticsDashboard} />
          <Route path="/quora/upvotegraph" component={upvotegraph} />
          <Route path="/quora/downvotegraph" component={downvotegraph} />
          <Route path="/quora/answerviewsgraph" component={answerviewsgraph} />
          <Route path="/quora/profileviewsgraph" component={profileviewsgraph}/>
          <Route path="/quora/bookmarksgraph" component={bookmarksgraph}/>
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