
import React from 'react';
import '../../Styles/Comments.css' 
import defaultProfilePic from '../../Images/profile_logo.png'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import axios from 'axios'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

class CommentDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userImg: ''
    }
  }

  componentWillMount() {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
    console.log("Debug "+ JSON.stringify(this.props.comment) +" profile pic req: ");
    axios.get('/quora/profilepic?userid=' + this.props.comment.owner_userid)
        .then((response) => {
            if (response !== undefined)
                if (response.status === 200) {
                  
                  console.log("Debug "+ this.props.comment.owner_username +" profile pic res: " + JSON.stringify(response.data));
                  if(response.data.base64.length > 0) {
                  console.log("Debug profile pic res: " + JSON.stringify(response.data.base64[0].b64));
                    this.setState({ userImg: response.data.base64[0].b64 });
                }
              }
        })

  }

  render() {
    // console.log(JSON.stringify(this.props.comments))
    if(!this.props.comment) return null;
      // console.log(JSON.stringify(comment))
    //   <CommentListItem key={ "comment-" + comment.id } comment={comment} voteOnComment={voteOnComment} />
    var comment = this.props.comment;
      if(Object.keys(comment).length === 0) {
        return(<img src="https://image.ibb.co/iYo1yw/Screen_Shot_2017_09_28_at_6_43_28_PM.png" alt={`loading-image`}  className="loading-image" />);
      } else {
        var userImg = defaultProfilePic;
      if(this.state.userImg !== '' && this.state.userImg !== 'default') {
          console.log("Debug profile pic : " + this.state.userImg)
          userImg = this.state.userImg
      }
  
        return (
          <li className="comment-list-item">
            <div className="comment-header">
            <img src={userImg} alt="" className="answerer-pro-pic" />
            <div className="comment-details">
                <h1>{comment.owner_name}</h1>
                <h2> {timeAgo.format(new Date(comment.timestamp))}</h2>
              </div>
            </div>
            <div className="comment-body">{comment.comment}</div>
          </li>
        );
  
      }
  }
}

export default CommentDetails;
