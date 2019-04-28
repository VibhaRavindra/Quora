import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import '../../Styles/Answer.css'
import '../../Styles/AnswerButtons.css'
import defaultProfilePic from '../../Images/profile_logo.png'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import axios from 'axios'


TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

class AnswerDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentOpen: false,
      upvoteText: 'Upvote',
      upvoteCount: 0,
      upvoteClass: "answer-upvote-unselected-icon answer-upvote-unselected-icon-label",
      downvoteClass: "answer-downvote-unselected-icon"
    };
    this.UpvoteAnswer = this.UpvoteAnswer.bind(this);
    this.DownvoteAnswer = this.DownvoteAnswer.bind(this);
    // this.comments = this.comments.bind(this)
  }

  componentWillMount() {
    //alert(this.props.answer.answer)
    //this.props.requestAnswer(this.props.id);
    var upvotes = this.props.answer.upvotes
    var downvotes = this.props.answer.downvotes
    var upvoteText = 'Upvote'
    var upvoteClass = "answer-upvote-unselected-icon answer-upvote-unselected-icon-label"
    var downvoteClass = "answer-downvote-unselected-icon"

    console.log("Debug answer username: " + localStorage.user_name)
    if (upvotes.includes(localStorage.user_name)) {
      upvoteText = 'Upvoted'
      upvoteClass = "answer-upvote-selected-icon answer-upvote-selected-icon-label"
    }
    if (downvotes.includes(localStorage.user_name)) {
      downvoteClass = "answer-downvote-selected-icon"
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
      upvoteClass: upvoteClass,
      downvoteClass: downvoteClass
    })

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

    var downvoteState = (this.state.downvoteClass === 'answer-downvote-unselected-icon') ?
      {
        toggle: "true",
        downvoteClass: "answer-downvote-selected-icon"
      } : {
        toggle: "false",
        downvoteClass: "answer-downvote-unselected-icon"
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
              downvoteClass: downvoteState.downvoteClass
            })
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
            <div className="question-footer-elem-share-icons answer-icon-hide" style={{ marginLeft: "25.5em" }}>
              <div className={this.state.downvoteClass} onClick={() => { this.DownvoteAnswer(this.props.answer.question_id, this.props.answer._id) }}>&nbsp;</div>
            </div>
            <div className="question-footer-elem-share-icons">
              <div className="share-icon answer-icon-hide">&nbsp;</div>
            </div>
            <div className="question-footer-elem-share-icons">
              <div className="dots-icon answer-icon-hide">&nbsp;</div>
            </div>

          </div>
        </div>
      </div>
    );

    if (!this.props.answer.owner_profile_pic || !this.props.answer.owner_profile_pic.startsWith("http")) {
      imgdiv = <img src={defaultProfilePic} className="answerer-pro-pic" />
    } else {
      imgdiv = <img src={this.props.answer.owner_profile_pic} className="answerer-pro-pic" />
    }
    return (
      <li className="answer-item">
        <div className="answer-header">
          {imgdiv}
          <div className="answer-details">
            <h1>{this.props.answer.owner_name}, {this.props.answer.owner_tagline}</h1>
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