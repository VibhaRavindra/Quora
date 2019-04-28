import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import '../../Styles/Answer.css' 
import '../../Styles/AnswerButtons.css'
import defaultProfilePic from '../../Images/profile_logo.png'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

class AnswerDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentOpen: false
    };
     this.props = {
      question_id: '5cbddb2ca8bd2772b4f4545b',
      answer_id: '5cbebde585cadf9f186f3f79'
    }

    // this.comments = this.comments.bind(this)
  }

  componentWillMount() {
   //alert(this.props.answer.answer)
    //this.props.requestAnswer(this.props.id);

  }

  render() {
    //const { answer } = this.props;
    // const {id, body, author, time_posted_ago, upvoter_ids, upvoted, downvoted, commentIds} = answer;
    //let answerBody;
    console.log("==================================================================")
    console.log(JSON.stringify(this.props.answer))
    console.log("==================================================================")
    let deltaOps = JSON.parse(this.props.answer.answer).ops
    var htmlText = new QuillDeltaToHtmlConverter(deltaOps, {}).convert();
    console.log(deltaOps)
    console.log(htmlText)
    var imgdiv = ''
    console.log()
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
      </li>
    );
  }
}


export default AnswerDetails;