import React from 'react';
import { withRouter } from "react-router-dom";
import ReactQuill from 'react-quill';
import '../../Styles/Answer.css'
import '../../Styles/AnswerButtons.css'
import '../../../node_modules/quill/dist/quill.snow.css'
import axios from 'axios'
import {Redirect} from 'react-router-dom';

class AnswerForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      text: '', 
      open: false,
      redirectVar:''
   };
    this.handleChange = this.handleChange.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
    this.successfulSubmit = this.successfulSubmit.bind(this);
  }

  handleChange(content, delta, source, editor) {
   this.setState({ text: content,
  delta: editor.getContents() })
 }

 successfulSubmit() {
   
 }

 componentWillMount() {
   console.log("Debug from mount")
   this.setState ({
     redirectVar: ''
   })
 }

 submitAnswer(e) {
   console.log(this.state.text)
   console.log(this.state.delta)
   console.log("Debug submit answers")


   let data = {
    answer: JSON.stringify(this.state.delta),
    user_username: localStorage.user_name,
    user_name: localStorage.fullname,
    user_profile_pic: "swe.jpg",
    user_tagline: "Software Engineer",
  }
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
  axios.post('/answer/'+this.props.question_id, data)
    .then((response) => {
        if (response !== undefined)
            if (response.status === 200) {
                console.log(response);
                var path = '/answer/question/'+ this.props.question_id;
                console.log("Debug axios success")
                this.props.closeAnswerFormAndReload()
            }
    });
  }

  render () {
  //  if (this.state.open) {
  //     const author = this.props.current_user;
      console.log(this.props.question_id);
      console.log("Debug answer form render")

      return (

        <div className="answer-form-container">
         {this.state.redirectVar}
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
            <button className="submit-button" onClick={this.submitAnswer}>Submit</button>
            </div>
          </div>
        </div>

      );
    } 
  //   else {
  //     return (
  //       <div className="answer-form-container">
  //       <button className="write-answer-button" onClick={()=>this.setState({open: true})}>Answer</button>
  //       </div>
  //     );
  //   }

  // }

}


const modules = {
  toolbar: [
    ["bold", "italic"], // toggled buttons
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["image", "link"] // misc
  ]
};

export default withRouter(AnswerForm);