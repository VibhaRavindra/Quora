import React from 'react';
import defaultProfilePic from '../../Images/profile_logo.png'
import axios from 'axios'

class CommentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '', userImg: '' };
    this.handleChange = this.handleChange.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.successfulSubmit = this.successfulSubmit.bind(this);
  }
 

componentWillMount() {
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
  axios.get('/quora/profilepic?userid=' + localStorage.userid)
      .then((response) => {
          if (response !== undefined)
              if (response.status === 200) {
                
                if(response.data.base64.length > 0) {
                  this.setState({ userImg: response.data.base64[0].b64 });
              }
            }
      })

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
   user_id: localStorage.userid,
   user_name: localStorage.fullname,
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
      if(this.state.userImg !== '' && this.state.userImg !== 'default') {
          userImg = this.state.userImg
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