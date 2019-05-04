import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import '../../Styles/Answer.css'
import '../../Styles/AnswerButtons.css'
import defaultProfilePic from '../../Images/profile_logo.png'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import axios from 'axios'
import {rooturl} from '../../Config/settings'
import { Link } from "react-router-dom";
import anonymousProfilePic from '../../Images/anonymous_logo.png'


TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

class AnswerDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentOpen: false,
      upvoteText: 'Upvote',
      downvoteText: 'Downvote',
      bookmarkText: 'Bookmark',
      upvoteCount: 0,
      upvoteClass: "answer-upvote-unselected-icon answer-upvote-unselected-icon-label",
      bookmarkClass: "answer-bookmark-unselected-icon answer-bookmark-unselected-icon-label",
      downvoteClass: "answer-downvote-unselected-icon"
    };
    this.UpvoteAnswer = this.UpvoteAnswer.bind(this);
    this.DownvoteAnswer = this.DownvoteAnswer.bind(this);
    this.BookmarkAnswer = this.BookmarkAnswer.bind(this);
    // this.comments = this.comments.bind(this)
  }
componentDidMount(){
  var data={
    id:this.props.answer._id,
    answer:this.props.answer.answer,
    owner_username:this.props.answer.owner_username,
    personviewed:localStorage.getItem("user_name")
  }
  axios.post("http://"+rooturl+":3001/quora/updateanswerview",data)
}
  componentWillMount() {
    //alert(this.props.answer.answer)
    //this.props.requestAnswer(this.props.id);
  
    var upvotes = this.props.answer.upvotes
    var downvotes = this.props.answer.downvotes
    var bookmarked_by = this.props.answer.bookmarked_by
    var upvoteText = 'Upvote'
    var downvoteText = 'Downvote'
    var bookmarkText = 'Bookmark'
    var upvoteClass = "answer-upvote-unselected-icon answer-upvote-unselected-icon-label"
    var bookmarkClass = "answer-bookmark-unselected-icon answer-bookmark-unselected-icon-label"
    var downvoteClass = "answer-downvote-unselected-icon  answer-downvote-unselected-icon-label"
    
    console.log("Debug answer username: " + localStorage.user_name)
    if (upvotes.includes(localStorage.user_name)) {
      upvoteText = 'Upvoted'
      upvoteClass = "answer-upvote-selected-icon answer-upvote-selected-icon-label"
    }
    if (downvotes.includes(localStorage.user_name)) {
      downvoteText = 'Downvoted'
      downvoteClass = "answer-downvote-selected-icon answer-downvote-selected-icon-label"
    }
    if (bookmarked_by.includes(localStorage.user_name)) {
      var bookmarkText = 'Bookmarked'
      bookmarkClass = "answer-bookmark-selected-icon answer-bookmark-selected-icon-label"
    }
    //     var found = false;
    //   for(var i = 0; i < upvotes.length; i++) {
    //     if (upvotes[i].username === localStorage.username) {
    //         found = true;
    //         break;
    //     }
    // }

    this.setState({
      upvoteCount: this.props.answer.upvote_count,
      upvoteText: upvoteText,
      downvoteText: downvoteText,
      bookmarkText: bookmarkText,
      upvoteClass: upvoteClass,
      downvoteClass: downvoteClass,
      bookmarkClass: bookmarkClass
    })

  }
  componentDidMount(){
    console.log(this.props.answer._id,"Hello");
   
    
  }


  UpvoteAnswer = (questionId, answerId) => {
    console.log("Debug upvote")

    var upvoteState = (this.state.upvoteText === 'Upvote') ?
      {
        toggle: "true",
        upvoteCount: this.state.upvoteCount + 1,
        upvoteText: 'Upvoted',
        upvoteClass: "answer-upvote-selected-icon answer-upvote-selected-icon-label"
      } : {
        toggle: "false",
        upvoteCount: this.state.upvoteCount - 1,
        upvoteText: 'Upvote',
        upvoteClass: "answer-upvote-unselected-icon answer-upvote-unselected-icon-label"
      }

    let data = {
      user_username: localStorage.user_name,
    }
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
    axios.post('/answer/' + questionId + '/' + answerId + '?upvote=' + upvoteState.toggle, data)
      .then((response) => {
        if (response !== undefined)
          if (response.status === 200) {
            console.log(response);
            console.log("Debug axios success")
            this.setState({
              upvoteCount: upvoteState.upvoteCount,
              upvoteText: upvoteState.upvoteText,
              upvoteClass: upvoteState.upvoteClass
            })
          }
      });
  };
  
  DownvoteAnswer = (questionId, answerId) => {
    console.log("Debug downvote")

    var downvoteState = (this.state.downvoteText === 'Downvote') ?
      {
        toggle: "true",
        downvoteText: 'Downvoted',
        downvoteClass: "answer-downvote-selected-icon answer-downvote-selected-icon-label"
      } : {
        toggle: "false",
        downvoteText: 'Downvote',
        downvoteClass: "answer-downvote-unselected-icon answer-downvote-unselected-icon-label"
      }

    let data = {
      user_username: localStorage.user_name,
    }
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
    axios.post('/answer/' + questionId + '/' + answerId + '?downvote=' + downvoteState.toggle, data)
      .then((response) => {
        if (response !== undefined)
          if (response.status === 200) {
            console.log(response);
            console.log("Debug axios success")
            this.setState({
              downvoteClass: downvoteState.downvoteClass,
              downvoteText: downvoteState.downvoteText
            })
          }
      });
  };

  BookmarkAnswer = (questionId, answerId) => {
    console.log("bookmarked answer: "+questionId+" : "+answerId);

    var bookmarkState = (this.state.bookmarkText === 'Bookmark') ?
      {
        toggle: "true",
        bookmarkText: 'Bookmarked',
        bookmarkClass: "answer-bookmark-selected-icon answer-bookmark-selected-icon-label"
      } : {
        toggle: "false",
        bookmarkText: 'Bookmark',
        bookmarkClass: "answer-bookmark-unselected-icon answer-bookmark-unselected-icon-label"
      }
      let data = {
        user_username: localStorage.user_name,
        user_id: localStorage.userid
      }
      axios.defaults.withCredentials = true;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
      axios.post('/answer/' + questionId + '/' + answerId + '/bookmark?bookmarkState=' + bookmarkState.toggle, data)
        .then((response) => {
          if (response !== undefined)
            if (response.status === 200) {
              console.log(response);
              console.log("Debug axios success")
              this.setState({
                bookmarkClass: bookmarkState.bookmarkClass,
                bookmarkText: bookmarkState.bookmarkText
              }, this.props.reloadBookmarks)
            }
        });
   

  };

  render() {
    //const { answer } = this.props;
    // const {id, body, author, time_posted_ago, upvoter_ids, upvoted, downvoted, commentIds} = answer;
    //let answerBody;
    console.log("==================================================================")
    console.log(JSON.stringify(this.props.answer))
    console.log(this.props.answer.question_id);
    console.log("==================================================================")
    let deltaOps = JSON.parse(this.props.answer.answer).ops
    var htmlText = new QuillDeltaToHtmlConverter(deltaOps, {}).convert();
    console.log(deltaOps)
    console.log(htmlText)
    var imgdiv = ''
    console.log()

    let answerFooterDiv = null;
    answerFooterDiv = (
      <div>
        <div>
          <div className="row" style={{ marginTop: "0.3em" }}>
            <div className="question-footer-elem" style={{ marginLeft: "0.3em" }}>
              <div className={this.state.upvoteClass} onClick={() => { this.UpvoteAnswer(this.props.answer.question_id, this.props.answer._id) }}>{this.state.upvoteText} <span class="bullet"> · </span> {this.state.upvoteCount}</div>
            </div>
            <div className="question-footer-elem">
              <div className={this.state.downvoteClass} onClick={() => { this.DownvoteAnswer(this.props.answer.question_id, this.props.answer._id) }}>{this.state.downvoteText} </div>
            </div>
            <div className="question-footer-elem">
              <div className={this.state.bookmarkClass} onClick={() => { this.BookmarkAnswer(this.props.answer.question_id,this.props.answer._id) }}>{this.state.bookmarkText} </div>
            </div>

          </div>
        </div>
      </div>
    );

    var userImg = defaultProfilePic;
    if(this.props.answer.owner_username === "anonymous@quora.com") {
      userImg = anonymousProfilePic;
    }
    else if (!this.props.answer.owner_profile_pic && !this.props.answer.owner_profile_pic === "undefined" && !this.props.answer.owner_profile_pic === "default" && !this.props.answer.owner_profile_pic.includes(".")) {
      userImg = "data:image/jpg;base64," + this.props.answer.owner_profile_pic
    } 

    var tagline = (this.props.answer.owner_tagline && this.props.answer.owner_tagline !== 'undefined' && this.props.answer.owner_tagline !== '') ? ', ' + this.props.answer.owner_tagline : ''
    return (
      <li className="answer-item">
        <div className="answer-header">
        <img src={userImg} className="answerer-pro-pic" />
          <div className="answer-details">
            <h1><Link className="question-link" to={"/quora/profile/" + this.props.answer.owner_username}>{this.props.answer.owner_name}</Link>{tagline}</h1>
            <h2>Answered {timeAgo.format(new Date(this.props.answer.timestamp))}</h2>
          </div>
        </div>
        <div className="answer-body">{ReactHtmlParser(htmlText)}</div>
        {answerFooterDiv}
      </li>
    );
  }
}


export default AnswerDetails;