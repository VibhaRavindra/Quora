import React, { Component } from 'react';
import '../../Styles/Home.css';
import { Link } from "react-router-dom";
import unfollow from '../../Images/unfollow.png';
import axios from 'axios';
import AnswerDetails from '../Answers/AnswerDetails';
import AnswerForm from "../Answers/AnswerForm";
import swal from 'sweetalert';
import {rooturl} from '../../Config/settings'

class DisplayBookmark extends Component {
    constructor(props) {
        super(props);
        this.state = {
            followedquestions:[],
        }
    }

    render(){

      
        let record = this.props.question;
        let answerDiv = null;
        
        if (record.answers.length>0) {
            let answer = record.answers[0];
            console.log(answer);
            answerDiv = <AnswerDetails answer={answer} reloadBookmarks={this.props.reloadBookmarks }/>;
        }

        return(
            
            <div className="card question-card">
                    <div className="card-body question-card-body">
                        <Link className="question-link" to={"/quora/question/" + record._id}>
                            <span className="card-title question-card  question-card-title">{record.question}</span>
                        </Link>
                        {answerDiv}
                    </div>
                </div>
        )
    }
}
export default DisplayBookmark;
