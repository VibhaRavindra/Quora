import React from 'react';

import ReactQuill from 'react-quill';
import '../../Styles/Answer.css'
import '../../Styles/AnswerButtons.css'
import '../../../node_modules/quill/dist/quill.snow.css'
import axios from 'axios'


class AnswerForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '', open: false };
    this.handleChange = this.handleChange.bind(this);
    //this.submitAnswer = this.submitAnswer.bind(this);
    //this.successfulSubmit = this.successfulSubmit.bind(this);
  }

  handleChange(content, delta, source, editor) {
   this.setState({ text: content,
  delta: editor.getContents() })
 }

//  successfulSubmit({answer}) {
//    this.props.history.push(`/answers/${answer.id}`);
//  }

 submitAnswer() {
   console.log(this.state.text)
   console.log(this.state.delta)

   let data = {
    answer: JSON.stringify(this.state.delta),
    user_username: "swetha.suresh@sjsu.edu",
    user_name: "swetha suresh",
    user_profile_pic: "swe.jpg",
    user_tagline: "Software Engineer",
  }
//retrieves the courses based on information entered
// axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
//axios.post('/answer/5cbddb2ca8bd2772b4f4545b', data)
axios.post('/answer/'+this.props.question_id, data)
    .then((response) => {
        if (response !== undefined)
            if (response.status === 200) {
                console.log(response);
            }
    })
  //  this.props.createAnswer(this.state.text, this.props.questionId).then(
  //    this.successfulSubmit
  //  );
  }

  render () {
   //if (this.state.open) {
      //const author = this.props.current_user;
      console.log(this.props.question_id);
      return (

        <div className="answer-form-container">
         
          <div className="answer-form">
            <div className="answer-header">
              <img src="https://centrik.in/wp-content/uploads/2017/02/user-image-.png" alt="User 1's Picture"  className="answerer-pro-pic" />
              <div className="answer-details">
                <h1>Anonymous</h1>
              </div>
            </div>
            <ReactQuill value={this.state.text}
                        onChange={this.handleChange}
                        modules={modules}
                        placeholder={"Write your answer"}/>

            <div className="answer-form-footer">
            <button className="submit-button" onClick={()=>this.submitAnswer()}>Submit</button>
            </div>
            {JSON.stringify(this.state.delta)}
          </div>
        </div>

      );
    //} 
    //else {
    //   return (
    //     <div className="answer-form-container">
    //     <button className="write-answer-button" onClick={()=>this.setState({open: true})}>Answer</button>
    //     </div>
    //   );
    // }

  }

}


const modules = {
  toolbar: [
    ["bold", "italic"], // toggled buttons
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["image", "link"] // misc
  ]
};

export default AnswerForm;