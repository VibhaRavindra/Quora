import React, { Component } from 'react';
import '../../Styles/Home.css';
import { Link } from "react-router-dom";
import unfollow from '../../Images/unfollow.png';
import followImg from '../../Images/feed-unfollow.svg';
import axios from 'axios';
import AnswerDetails from '../Answers/AnswerDetails';
import AnswerForm from "../Answers/AnswerForm";
import swal from 'sweetalert';
import {rooturl} from '../../Config/settings'

class DisplayQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            followedquestions:[],
            openAnswer: '',
            follow:false,
            status:[],
            inc:[]
      
        }
    }

    CreateAnswer = (questionId) => {
        console.log(questionId);
        this.setState({
            openAnswer: <AnswerForm question_id={questionId} closeAnswerFormAndReload={this.closeFormAndReload} />
        })
    };

    closeFormAndReload = () => {
            swal("Saved answer");
            this.setState({ openAnswer: '' });
            this.props.reload();
    }

    followquestion=(e,x,y)=>{
        console.log(localStorage.getItem("user_name"));
        var newstatus=this.state.status;
        newstatus[x]=true;
        console.log(newstatus,"eve new un")
        var newinc=this.state.inc
        newinc[x]=newinc[x]+1;
        this.setState({status:newstatus,inc:newinc})
        swal("followed question");
        var data={
            follower_username:localStorage.getItem("user_name"),
            qid:x,
            question:y
        }
        axios.post("http://"+rooturl+":3001/quora/question/followquestion",data, localStorage.getItem('jwtToken'))
    
    }
    unfollowquestion=(e,x,y)=>{
     console.log(localStorage.getItem("user_name"));
     var newstatus=this.state.status;
     newstatus[x]=false;
     console.log(newstatus,"eve new un")
     var newinc=this.state.inc
     newinc[x]=newinc[x]-1;
     this.setState({status:newstatus,inc:newinc})
     swal("unfollowed question");
    
     var data={
         follower_username:localStorage.getItem("user_name"),
         qid:x,
         question:y
     }
     axios.post("http://"+rooturl+":3001/quora/question/unfollowquestion",data, localStorage.getItem('jwtToken'))

 }
        
componentDidMount(){
    var status={},inc={};

    this.props.question.followers.includes(localStorage.getItem("user_name")) ?
    status[this.props.question._id]=true :  status[this.props.question._id]=false
    if(this.props.question.followers)
    inc[this.props.question._id]=this.props.question.followers.length
       
    this.setState({
        status:status,inc:inc
    });



}
    render(){

      
        let record = this.props.question;
        let index = this.props.questionIndex;
        let answerDiv = null;
        let followDiv=null;
       
        if (record.answers.length>0) {
            let answer = record.answers[0];
            console.log(answer);
            answerDiv = <AnswerDetails answer={answer}/>;
        }
        console.log(this.state.status[record._id])
        if(this.state.status[record._id]===false)
        {
            followDiv=<div className="follow-icon answer-icon-label" onClick={e=>this.followquestion(e,record._id,record.question)}>
            Follow { this.state.inc[record._id]}</div>
  
        }
        else 
        {
            followDiv= <div id="unfollow-ques answer-icon-label" onClick={e=>this.unfollowquestion(e,record._id,record.question)}>
            <div className="home-follow-div home-follow-icon">
            <img src={followImg} className="home-follow-img" width="60" height="40" alt="0"/>Unfollow {"  "}{this.state.inc[record._id]}</div> </div>
              
        }

    
        let questionFooterDiv = null;
        questionFooterDiv = (
            <div>
                <div className="row" style={{ marginTop: "0.3em" }}>
                    <div className="question-footer-elem" style={{ marginLeft: "0.3em" }}>
                        <div className="answer-icon answer-icon-label" onClick={() => { this.CreateAnswer(record._id) }}>Answer</div>
                    </div>
                    <div className="question-footer-elem">
                        <div className="pass-icon answer-icon-label">Pass</div>
                    </div>
                    <div className="question-footer-elem" >
                       {followDiv}
                    </div>
                    <div className="question-footer-elem-share-icons">
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

            //console.log(this.props);

        return(
            
            <div className="card question-card">
                    <div className="card-body question-card-body">
                        <span className="pull-right clickable close-icon" data-effect="fadeOut" onClick={(event) => this.props.closeCardMethod(event, index)}><i class="fa fa-times"></i></span>
                        {this.props.isDefaultTopic ?
                        <p className="question-card-subtitle"> Answer . Topic you might like</p>
                        :
                        <p className="question-card-subtitle"> Answer . Topic you like</p>
                        }
                        <Link className="question-link" to={"/quora/question/" + record._id}>
                            <span className="card-title question-card  question-card-title">{record.question}</span>
                        </Link>
                        
                        {questionFooterDiv}
                        {this.state.openAnswer}
                        {answerDiv}
                    </div>
                </div>
        )
    }
}
export default DisplayQuestion;
