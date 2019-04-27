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
   user_name: localStorage.firstname + " " + localStorage.lastname,
   user_profile_pic: "swe.jpg",
 }

 axios.defaults.withCredentials = true;
 axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
 axios.post('/answer/'+this.props.answer.question_id + '/' + this.props.answer._id + '/comment', data)
   .then((response) => {
       if (response !== undefined)
           if (response.status === 200) {
               console.log(response);
               console.log("Debug axios success")
               this.props.closeCommentFormAndReload()
           }
   });
  }

  render () {
    var imgdiv=null;
    if (!localStorage.owner_profile_pic || !localStorage.owner_profile_pic.startsWith("http")) {
      imgdiv = <img src={defaultProfilePic} className="answerer-pro-pic" />
    } else {
      imgdiv = <img src={localStorage.owner_profile_pic} className="answerer-pro-pic" />
    }
      return (
        <div className="comment-form">
        {imgdiv}
          <input className="comment-input" type="text" onChange={this.handleChange} value={this.state.text} placeholder="Add a comment..."></input>
          <button className="comment-button" onClick={(e)=>this.submitComment(e)}>Add Comment</button>
        </div>
      );
  }

}

export default CommentForm;