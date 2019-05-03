import React, { Component } from 'react';
import '../../Styles/Search.css';
import Header from '../Navigation/Header';
import { yourQuestions } from "../../js/actions/action";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import notify from '../../Images/profile-notify.svg';
import followPerson from '../../Images/follow-person.svg';

function mapStateToProps(store) {
    return {
        questionsAskedSuccess:store.account.questionsAskedSuccess,
        questions_asked_array:store.account.questions_asked_array
        // yourAnswers:store.account.yourAnswers,
        // yourQuestionsFollowed:store.account.yourQuestionsFollowed
    }
}

function mapDispatchToProps(dispatch) {
    return {
        yourQuestions: (data) => dispatch(yourQuestions(data)),
        // yourAnswers: (data) => dispatch(yourAnswers(data)),
        // yourQuestionsFollowed: (data) => dispatch(yourQuestionsFollowed(data))
    };
}




class SearchQuestions extends Component {
    constructor(props){
        super(props);
        this.state = {
            profiles: []
        }
    }
    async componentDidMount(){
        this.props.yourQuestions(localStorage.getItem('userid'));
        // this.props.yourAnswers(localStorage.getItem('userid'));
        // this.props.yourQuestionsFollowed(localStorage.getItem('userid'));
    }
    render() {
        let questions_asked = this.props.questions_asked_array.map(question_asked => {   
            return(
                <div className="question-container">
                    {/* <Link to={} ></Link> */}

                    <div className="profile-header">
                        <span className="question-text">{question_asked.question}</span>
                    </div>
                    <div className="profile-aboutme">{question_asked.aboutme}</div>
                    <div className="row question-row">
                        <div className="follow-question">
                            <img className="follow-logo" src={followPerson} alt="follow"/>
                            <span className="follow-text">Follow</span>
                            <span className="numFollowers">{question_asked.num_of_followers}</span>
                        </div>
                        <div className="follow-question">
                            <img className="profile-notify" src={notify} alt="notify"/>
                            <span className="profile-notify">Notify Me</span>
                        </div>
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
                            <div className="search-questions search-div search-div-bg">
                                <li className="search-item letter-space">Questions Asked</li>
                            </div>
                            <div className="search-profiles search-div">
                                <li className="search-item letter-space">Questions Followed</li>
                            </div>
                            <div className="search-topics search-div">
                                <li className="search-item letter-space">Answers</li>
                            </div>
                        </ul>
                    </div>
                    <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Your Questions <span className="question-value">{this.props.match.params.searchValue}</span></h2>
                        </div>
                        {questions_asked}
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchQuestions);
