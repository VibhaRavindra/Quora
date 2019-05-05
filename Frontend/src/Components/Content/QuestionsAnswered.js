import React, { Component } from 'react';
import '../../Styles/Search.css';
import Header from '../Navigation/Header';
import { yourAnswers } from "../../js/actions/action";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

function mapStateToProps(store) {
    return {
        questionsAnsweredSuccess:store.account.questionsAnsweredSuccess,
        questions_answered_array:store.account.questions_answered_array
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // yourQuestions: (data) => dispatch(yourQuestions(data)),
        yourAnswers: (data) => dispatch(yourAnswers(data)),
        // yourQuestionsFollowed: (data) => dispatch(yourQuestionsFollowed(data))
    };
}

class SearchQuestions extends Component {

    async componentDidMount(){
        // this.props.yourQuestions(localStorage.getItem('userid'));
        // this.props.yourAnswers(localStorage.getItem('userid'));
        this.props.yourAnswers(localStorage.getItem('userid'));
    }
    render() {
        let questions_followed = this.props.questions_followed_array.map(question_followed => {   
            return(
                <div className="question-container">
                    <div className="profile-header">
                        <Link to={"/quora/question/"+question_followed.questionid}>
                            <span className="question-text">{question_followed.question}</span>
                        </Link>
                    </div>
                    <div className="row question-row">
                        <h2>Asked {timeAgo.format(new Date(question_followed.timestamp))}</h2>
                    </div>
                </div>
            )
        })
        return (
            <div>
                <Header></Header>
                <div className="container-wrapper">
                    <div className="search-sidebar">
                        <div className="search-title">By Type</div>
                        <ul className="search-ul">
                            <Link to={"/quora/content/questions_asked"}>
                                <div className="search-questions search-div">
                                    <li className="search-item letter-space">Questions Asked</li>
                                </div>
                            </Link>
                            <div className="search-profiles search-div search-div-bg">
                                <li className="search-item letter-space">Questions Followed</li>
                            </div>
                            <Link to={"/quora/content/answers"}>
                                <div className="search-topics search-div">
                                    <li className="search-item letter-space">Answers</li>
                                </div>
                            </Link>
                        </ul>
                    </div>
                    <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Your Questions <span className="question-value">{this.props.match.params.searchValue}</span></h2>
                        </div>
                        {questions_followed}
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchQuestions);
