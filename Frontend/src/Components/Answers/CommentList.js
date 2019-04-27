
import React from 'react';
import '../../Styles/Comments.css' 
import defaultProfilePic from '../../Images/profile_logo.png'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

class CommentList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    // console.log(JSON.stringify(this.props.comments))
    if(!this.props.comments) return null;
    const commentItems = this.props.comments.map( comment => {
      // console.log(JSON.stringify(comment))
    //   <CommentListItem key={ "comment-" + comment.id } comment={comment} voteOnComment={voteOnComment} />
      if(Object.keys(comment).length === 0) {
        return(<img src="https://image.ibb.co/iYo1yw/Screen_Shot_2017_09_28_at_6_43_28_PM.png" alt={`loading-image`}  className="loading-image" />);
      } else {
          var imgdiv = ''
        if (!comment.owner_profile_pic || !comment.owner_profile_pic.startsWith("http")) {
            imgdiv = <img src={defaultProfilePic} className="answerer-pro-pic" />
          } else {
            imgdiv = <img src={comment.owner_profile_pic} className="answerer-pro-pic" />
          }
  
        return (
          <li className="comment-list-item">
            <div className="comment-header">
              {imgdiv}
              <div className="comment-details">
                <h1>{comment.owner_name}</h1>
                <h2> {timeAgo.format(new Date(comment.timestamp))}</h2>
              </div>
            </div>
            <div className="comment-body">{comment.comment}</div>
          </li>
        );
  
      }
  
    });

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
