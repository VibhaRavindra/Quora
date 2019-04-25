import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import '../../Styles/Answer.css'
import '../../Styles/AnswerButtons.css'


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
    return (
      <li className="answer-item">
        <div className="answer-header">
          <img src="https://centrik.in/wp-content/uploads/2017/02/user-image-.png" alt="author.name's picture" className="answerer-pro-pic" />
          <div className="answer-details">
            <h1>author.name</h1>
            <h2>Answered time_posted_ago</h2>
          </div>
        </div>
        <div className="answer-body">{ReactHtmlParser(htmlText)}</div>
        <div className="answer-buttons">
          <button className="comments-button" onClick={() => this.setState({ commentOpen: !this.state.commentOpen })}>Comments </button>
        </div>
      </li>
    );
  }
}


export default AnswerDetails;