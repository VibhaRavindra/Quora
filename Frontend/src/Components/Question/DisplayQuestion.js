import React, { Component } from 'react';
import '../../Styles/Home.css';
import { Link } from "react-router-dom";
import unfollow from '../../Images/unfollow.png';
import axios from 'axios';

class DisplayQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            followedquestions:[]
        }
    }

    followquestion=(e,x)=>{
        console.log(localStorage.getItem("user_name"));
        console.log("hiphip",x);
 
        var data={
            follower_username:localStorage.getItem("user_name"),
            qid:x
        }
        axios.post("http://localhost:3001/quora/question/followquestion",data, localStorage.getItem('jwtToken'))
 
    }
    unfollowquestion=(e,x)=>{
     console.log(localStorage.getItem("user_name"));
     console.log("hophop",x);
 
     var data={
         follower_username:localStorage.getItem("user_name"),
         qid:x
     }
     axios.post("http://localhost:3001/quora/question/unfollowquestion",data, localStorage.getItem('jwtToken'))
 
 }
        

    render(){

        let topicsArr = ["Technology", "Science"];
        localStorage.setItem("topics", topicsArr);

        let record = this.props.question;
        let index = this.props.questionIndex;
        let ansdiv = null;
        if (record.answers.length>0) {
            let imgdiv = null;
            //if (record.answers.owner_profile_pic == null) {
                imgdiv = <div className="questions-default-logo"></div>;
            //}

            if (record.answers[0].timestamp) {
                /* let timestamp = new Date(record.answer.timestamp);
                 var date = timestamp.getDate();
                 var month = timestamp.getMonth(); 
                 var year = timestamp.getFullYear();
                 var time = timestamp.getTime();
 
                 var dateTime = date + "/" +(month + 1) + "/" + year;*/

                var dateTime = record.answers[0].timestamp.replace("T", " ");
                dateTime = dateTime.substring(0, dateTime.indexOf('.'));
            }

            ansdiv = (
                <div style={{ marginTop: "0.3em" }}>
                    <div className="row">
                        <div className="col-1 answer-user-pic">
                            {imgdiv}
                        </div>
                        <div className="col-9">
                            <div className="row">
                                <Link className="question-link" to={"/profile/" + record.user_id}>
                                    <div className="answer-user-profile">{record.answers[0].owner_name},</div>
                                </Link>
                                <div className="answer-user-profile">&nbsp;{record.answers[0].owner_tagline}</div>
                            </div>
                            <div className="row">
                                <div className="answer-timestamp"><span>Answered&nbsp;</span>{dateTime}</div>
                            </div>

                        </div>

                    </div>
                    <div className="row answer-to-question">
                        {record.answers[0].answer}
                    </div>

                </div>
            );
        }

        let questionFooterDiv = null;
        questionFooterDiv = (
            <div>
                <div className="row" style={{ marginTop: "0.3em" }}>
                    <div className="question-footer-elem" style={{ marginLeft: "0.3em" }}>
                        <div className="answer-icon answer-icon-label">Answer</div>
                    </div>
                    <div className="question-footer-elem">
                        <div className="pass-icon answer-icon-label">Pass</div>
                    </div>
                    <div className="question-footer-elem" >
                    {record.followers.includes(localStorage.getItem("user_name")) ? <div id="unfollow-ques answer-icon-label" onClick={e=>this.unfollowquestion(e,record._id)}> <img src={unfollow} width="60" height="40" />{"  "}{(record.followers.length == 0)? "": record.followers.length}</div>:<div className="follow-icon answer-icon-label" onClick={e=>this.followquestion(e,record._id)}>Follow {(record.followers.length == 0)? "": record.followers.length}</div>}
                    </div>
                    <div className="question-footer-elem-share-icons" style={{ marginLeft: "18em" }}>
                        <div className="fb-icon answer-icon-hide">a</div>
                    </div>
                    <div className="question-footer-elem-share-icons">
                        <div className="twitter-icon answer-icon-hide">a</div>
                    </div>
                    <div className="question-footer-elem-share-icons">
                        <div className="share-icon answer-icon-hide">a</div>
                    </div>
                    <div className="question-footer-elem-share-icons">
                        <div className="dots-icon answer-icon-hide">a</div>
                    </div>

                </div>
            </div>
        );



        return(
            <div className="card question-card">
                    <div className="card-body question-card-body">
                        <span className="pull-right clickable close-icon" data-effect="fadeOut" onClick={(event) => this.closeDiv(event, index)}><i class="fa fa-times"></i></span>
                        {this.props.isDefaultTopic ?
                        <p className="question-card-subtitle"> Answer . Topic you might like</p>
                        :
                        <p className="question-card-subtitle"> Answer . Topic you like</p>
                        }
                        <Link className="question-link" to={"/question/" + record._id}>
                            <span className="card-title question-card">{record.question}</span>
                        </Link>
                        {ansdiv}
                        {questionFooterDiv}
                    </div>
                </div>
        )
    }
}
export default DisplayQuestion;