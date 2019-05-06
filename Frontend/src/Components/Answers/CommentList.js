
import React from 'react';
import '../../Styles/Comments.css' 
import defaultProfilePic from '../../Images/profile_logo.png'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import CommentDetails from './CommentDetails'
import axios from 'axios'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

class CommentList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userImg: ''
    }
  }

  componentWillMount() {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
    console.log("Debug "+ JSON.stringify(this.props.comments) +" profile pic req: ");
    axios.get('/quora/profilepic?userid=' + this.props.comments.owner_userid)
        .then((response) => {
            if (response !== undefined)
                if (response.status === 200) {
                  
                  console.log("Debug "+ this.props.comments.owner_username +" profile pic res: " + JSON.stringify(response.data));
                  if(response.data.base64.length > 0) {
                  console.log("Debug profile pic res: " + JSON.stringify(response.data.base64[0].b64));
                    this.setState({ userImg: response.data.base64[0].b64 });
                }
              }
        })

  }

  render() {
    // console.log(JSON.stringify(this.props.comments))
    if(!this.props.comments) return null;
    const commentItems = this.props.comments.map( comment => {
  
        return (
          <CommentDetails comment={comment} />
        );
  
      })

    return(
      <div id="comments-container">
        <ul className="comment-list">
          {commentItems}
        </ul>
      </div>
    );
  }
}

export default CommentList;
