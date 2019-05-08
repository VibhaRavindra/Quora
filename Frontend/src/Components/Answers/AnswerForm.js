import React from 'react';
import { withRouter } from "react-router-dom";
import ReactQuill from 'react-quill';
import '../../Styles/Answer.css'
import '../../Styles/AnswerButtons.css'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import '../../../node_modules/quill/dist/quill.snow.css'
import axios from 'axios'
import defaultProfilePic from '../../Images/profile_logo.png'
import anonymousProfilePic from '../../Images/anonymous_logo.png'
import {Redirect} from 'react-router-dom';

class AnswerForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      text: '', 
      open: false,
      redirectVar:'',
      userImg: '',
      isAnonymous: false
   };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
    this.editAnswer = this.editAnswer.bind(this);
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
   var htmlText = ''
   var delta = {}
   if(this.props.isEditing) {
     delta = this.props.answer.answer

     if(this.props.editedAnswer && this.props.editedAnswer !== 'undefined' && this.props.editedAnswer !== '') {
       delta = this.props.editedAnswer
     }

    let deltaOps = JSON.parse(delta).ops
    htmlText = new QuillDeltaToHtmlConverter(deltaOps, {}).convert();
   }

   
   axios.defaults.withCredentials = true;
   axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
   axios.get('/quora/profilepic?userid=' + localStorage.userid)
       .then((response) => {
           if (response !== undefined)
               if (response.status === 200) {
                 
                 if(response.data.base64.length > 0) {
                   console.log("Debug profile pic : " + response.data.base64[0].b64)
                   this.setState({ userImg: response.data.base64[0].b64 });
               }
             }
       })

   this.setState ({
     redirectVar: '',
     text:htmlText,
     delta:delta
   })
 }

 handleSelect(e) {
   this.setState({isAnonymous: !this.state.isAnonymous})
 }

 editAnswer(e) {
   console.log(this.state.text)
   console.log(this.state.delta)
   console.log("Debug edit answers")
   let data = {
    answer: JSON.stringify(this.state.delta),
    answer_id: this.props.answer._id
   }
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
  axios.post('/answer/'+this.props.question_id + "?isEditing=true", data)
    .then((response) => {
        if (response !== undefined)
            if (response.status === 200) {
                console.log(response);
                console.log("Debug axios success")
                this.props.closeAnswerFormAndReload(data.answer)
            }
    });
  }

 submitAnswer(e) {
   console.log(this.state.text)
   console.log(this.state.delta)
   console.log("Debug submit answers")
   let data = {
    answer: JSON.stringify(this.state.delta),
    user_username: "anonymous@quora.com",
    user_id: "anonymous",
    user_name: "Anonymous",
    user_profile_pic: "",
    user_tagline: "",
   }
   if(!this.state.isAnonymous){
  data = {
    answer: JSON.stringify(this.state.delta),
    user_username: localStorage.user_name,
    user_id: localStorage.userid,
    user_name: localStorage.fullname,
  }
}
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
  axios.post('/answer/'+this.props.question_id, data)
    .then((response) => {
        if (response !== undefined)
            if (response.status === 200) {
                console.log(response);
                console.log("Debug axios success")
                this.props.closeAnswerFormAndReload(data.answer)
            }
    });
  }

  render () {
  //  if (this.state.open) {
  //     const author = this.props.current_user;
      console.log(this.props.question_id);
      console.log("Debug answer form render")
      console.log(localStorage.b64)

      var userImg = defaultProfilePic;
      if(this.state.userImg !== '' && this.state.userImg !== 'default') {
          userImg = this.state.userImg
      }
      var userName = localStorage.fullname

      if(this.state.isAnonymous) {
        userImg = anonymousProfilePic
        userName = "Anonymous"
      }

      var submitDiv = (
        <div className="answer-form-footer">
        <button className="submit-button" onClick={this.submitAnswer}>Submit</button>
        <input className="ml-2" type="checkbox" id="defaultCheck1" value="option1" onChange={this.handleSelect}/>
        <label className="small ml-1" for="defaultCheck1">
        Answer Anonymously?
        </label>
        </div>
      );

      if(this.props.isEditing) {
        submitDiv = (
          <div className="answer-form-footer">
          <button className="submit-button" onClick={this.editAnswer}>Submit</button>
          </div>
          )
      }
      
      return (

        <div className="answer-form-container">
         {this.state.redirectVar}
          <div className="answer-form">
            <div className="answer-header">
              <img src={userImg} alt="" className="answerer-pro-pic" />
              <div className="answer-details">
                <h1>{userName}</h1>
              </div>
            </div>
            <ReactQuill value={this.state.text}
                        onChange={this.handleChange}
                        modules={modules}
                        placeholder={"Write your answer"}/>
            <div>
            {submitDiv}
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