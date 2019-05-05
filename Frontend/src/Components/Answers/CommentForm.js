import React from 'react';
import defaultProfilePic from '../../Images/profile_logo.png'
import axios from 'axios'

class CommentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '' };
    this.handleChange = this.handleChange.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.successfulSubmit = this.successfulSubmit.bind(this);
  }

  handleChange(e) {
   this.setState({ text: e.currentTarget.value })
 }

 successfulSubmit({comment}) {
   this.setState({text: ''});
 }

//need to add args here
 submitComment(e) {
  console.log(this.state.text)
  console.log(this.state.delta)
  console.log("Debug submit answers")


  let data = {
   comment: this.state.text,
   user_username: localStorage.user_name,
   user_name: localStorage.fullname,
   user_profile_pic: localStorage.b64,
 }

 axios.defaults.withCredentials = true;
 axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
 axios.post('/answer/'+this.props.answer.question_id + '/' + this.props.answer._id + '/comment', data)
   .then((response) => {
       if (response !== undefined)
           if (response.status === 200) {
               console.log(response);
               console.log("Debug axios success")
               this.setState({text: ''})
               this.props.closeCommentFormAndReload()
           }
   });
  }

  render () {
    var userImg = defaultProfilePic;
    if (!this.props.answer.owner_profile_pic && !this.props.answer.owner_profile_pic === "undefined" &&!this.props.answer.owner_profile_pic === "default" && !this.props.answer.owner_profile_pic.includes(".")) {
      userImg = "data:image/jpg;base64," + this.props.answer.owner_profile_pic
    } 
      return (
        <div className="comment-form">
        <img src={userImg} alt ="" className="answerer-pro-pic" />
          <input className="comment-input" type="text" onChange={this.handleChange} value={this.state.text} placeholder="Add a comment..."></input>
          <button className="comment-button" onClick={(e)=>this.submitComment(e)}>Add Comment</button>
        </div>
      );
  }

}

export default CommentForm;