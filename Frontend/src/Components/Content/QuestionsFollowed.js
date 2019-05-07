import React, { Component } from 'react';
import '../../Styles/Search.css';
import Header from '../Navigation/Header';
import { yourQuestionsFollowed } from "../../js/actions/action";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

function mapStateToProps(store) {
    return {
        questionsFollowedSuccess:store.account.questionsFollowedSuccess,
        questions_followed_array:store.account.questions_followed_array
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // yourQuestions: (data) => dispatch(yourQuestions(data)),
        // yourAnswers: (data) => dispatch(yourAnswers(data)),
        yourQuestionsFollowed: (data) => dispatch(yourQuestionsFollowed(data))
    };
}

class SearchQuestions extends Component {

    async componentDidMount(){
        // this.props.yourQuestions(localStorage.getItem('userid'));
        // this.props.yourAnswers(localStorage.getItem('userid'));
        this.props.yourQuestionsFollowed(localStorage.getItem('userid'));
    }
    render() {
        let curYearParam = this.props.match.params.year;
        if(curYearParam == null){
            curYearParam = "all"
        }
        let curYearSelection = null;
        if(curYearParam !== "all") {
            curYearSelection = Number(this.props.match.params.year);
        }

        let sortOrderParam = this.props.match.params.sortorder
        if(sortOrderParam == null){
            sortOrderParam = "newest";
        }

        let years = this.props.questions_followed_array.map((question_followed)=>{
            var d = new Date(question_followed.timestamp)
            return d.getFullYear();
        });
        let yearsSet = new Set(years);
        console.log("got years: ", yearsSet);
        let yearsFilter = [...yearsSet].sort().reverse().map(year=>{
            console.log("In year ", year)
            return(
                <Link to={"/quora/content/questions_followed/"+year}>
                <div className="search-profiles search-div">
                    <li className="search-item letter-space">{year}</li>
                </div>
                </Link>
            )
        })
        console.log(yearsFilter)
        let sorted_questions_followed_array = this.props.questions_followed_array.sort((e1, e2)=>{
            console.log("in sort ", new Date(e1.timestamp).getTime() , new Date(e2.timestamp).getTime())
            if(sortOrderParam === "newest")
            return new Date(e2.timestamp).getTime() - new Date(e1.timestamp).getTime()
            else
            return new Date(e1.timestamp).getTime() - new Date(e2.timestamp).getTime()
        })
        let questions_followed = sorted_questions_followed_array.map(question_followed => {   
            let d = new Date(question_followed.timestamp);
            let dYear = d.getFullYear();
            if(curYearSelection == null || dYear === curYearSelection) {
            return(
                <div className="question-container">
                    <div className="profile-header">
                        <Link to={"/quora/question/"+question_followed.questionid}>
                            <span className="question-text">{question_followed.question}</span>
                        </Link>
                    </div>
                    <div className="row question-row">
                    <h2 className="content-log">Asked {timeAgo.format(new Date(question_followed.timestamp))}</h2>
                    </div>
                </div>
            )
            } else {
                return null;
            }
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
                            <Link to={"/quora/content/questions_answered"}>
                                <div className="search-topics search-div">
                                    <li className="search-item letter-space">Answers</li>
                                </div>
                            </Link>
                        </ul>
                        <div className="search-title">By Year</div>
                        <ul className="search-ul">
                        <Link to={"/quora/content/questions_followed/all"}>
                                <div className="search-topics search-div">
                                    <li className="search-item letter-space">All Time</li>
                                </div>
                        </Link>
                        {yearsFilter}
                        </ul>
                        <div className="search-title">Sort Order</div>
                        <ul className="search-ul">
                        <Link to={"/quora/content/questions_followed/"+curYearParam+"/newest"}>
                                <div className="search-topics search-div">
                                    <li className="search-item letter-space">Newest First</li>
                                </div>
                        </Link>
                        <Link to={"/quora/content/questions_followed/"+curYearParam+"/oldest"}>
                                <div className="search-topics search-div">
                                    <li className="search-item letter-space">Oldest First</li>
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
