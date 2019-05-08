import React, { Component } from 'react';
import '../../Styles/Search.css';
import Header from '../Navigation/Header';
import { signup, signin } from "../../js/actions/action";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import followImg from '../../Images/feed-follow.svg';
import fb from '../../Images/feed-fb.svg';
import twitter from '../../Images/feed-twitter.svg';
import share from '../../Images/feed-share.svg';
import dots from '../../Images/feed-dots.svg';
import downvote_unselected from '../../Images/downvote-unselected.svg';
import ReactPaginate from 'react-paginate';
import unfollow from './unfollow.png'
import axios from 'axios'
import {rooturl} from '../../Config/settings'

function mapStateToProps(store) {
    return {
        signupSuccess:store.account.signupSuccess,
        signupMessage:store.account.signupMessage,
        signinSuccess:store.account.signinSuccess,
        signinMessage:store.account.signinMessage
    }
}

function mapDispatchToProps(dispatch) {
    return {
        signup: (data) => dispatch(signup(data)),
        signin: (data) => dispatch(signin(data))
    };
}

class SearchQuestions extends Component {
    constructor(props){
        super(props);
        this.state = {
            questions: [],
            //for pagination
            paginated_questions:[],
            results_per_page: 2,
            num_pages:0,
            status:[],
            inc:[]
        }
        this.populateSearchResults = this.populateSearchResults.bind(this)
        //for pagination
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    //for pagination
    handlePageClick(data){
        console.log(data.selected)
        let page_number = data.selected;
        let offset = Math.ceil(page_number * this.state.results_per_page)
        this.setState({
            paginated_questions : this.state.questions.slice(offset, offset +this.state.results_per_page)
        })
    }
    componentWillReceiveProps(newprops) {
        if(newprops.match.params.searchValue != null) {
            this.populateSearchResults(newprops.match.params.searchValue)
        } 
    }
    followquestion=(e,x,y)=>{
     e.preventDefault();
     var newstatus=this.state.status;
     newstatus[x]=true;
     console.log(newstatus,"eve new un")
     var newinc=this.state.inc
     newinc[x]=newinc[x]+1;
     this.setState({status:newstatus,inc:newinc})
        var data={
            follower_username:localStorage.getItem("user_name"),
            qid:x,
            question:y
        }
        axios.post("http://"+rooturl+":3001/quora/question/followquestion",data, localStorage.getItem('jwtToken'))
    
    }
    unfollowquestion=(e,x,y)=>{
        e.preventDefault();
        var newstatus=this.state.status;
        newstatus[x]=false;
        console.log(newstatus,"eve new un")
        var newinc=this.state.inc
        newinc[x]=newinc[x]-1;
        this.setState({status:newstatus,inc:newinc})
        var data={
            follower_username:localStorage.getItem("user_name"),
            qid:x,
            question:y
        }
        axios.post("http://"+rooturl+":3001/quora/question/unfollowquestion",data,              localStorage.getItem('jwtToken'))
    }
      
    async populateSearchResults(searchString){
        const getQuestionsDetails = await fetch('/search/questions/'+searchString, {
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const getQuestions = await getQuestionsDetails.json();
        const all_questions = getQuestions.questions_array
        const pages = Math.ceil(all_questions.length/this.state.results_per_page)
        this.setState({
            questions : all_questions,
            num_pages:pages,
            paginated_questions: all_questions.slice(0,this.state.results_per_page),
        });
        var status={},inc={};
        this.state.questions.map(member=> member.followers.includes(localStorage.getItem("user_name")) ? status[member.questionid]=true:status[member.questionid]=false
        )
        this.state.questions.map(member=>inc[member.questionid]=member.num_of_followers)
        this.setState({
            status:status,inc:inc
        });
    }
    componentDidMount(){
        this.populateSearchResults(this.props.match.params.searchValue)
    }
    render() {
        console.log("this.state.questions.length : " +this.state.questions.length)
        let allQuestions;
        if(this.state.questions.length > 0){
            allQuestions = this.state.paginated_questions.map(question => {     
                return(
                    <div className="question-container">
                        <Link to={"/quora/question/"+question.questionid}>
                            <div className="question-text">{question.question}</div>
                        </Link>
                        <div className="row question-row">
                        {this.state.status[question.questionid]=== false ?
                            <div className="follow-question"  onClick={(e)=>this.followquestion(e,question.questionid,question.question)}>
                                <img className="follow-logo" src={followImg} alt="follow"/>
                                <span className="follow-text">Follow</span>
                                {console.log(this.state.inc[question.questionid],"ufff")}
                                <span className="numFollowers">{this.state.inc[question.questionid]}</span>
                            </div>
                             :
                             <div className="follow-question" onClick={(e)=>this.unfollowquestion(e,question.questionid,question.question)}>
                                <img className="follow-logo" src={unfollow} alt="follow"/>
                                {console.log(this.state.inc[question.questionid],"ufff")}
                                <span className="numFollowers">{this.state.inc[question.questionid]}</span>
                            </div>}
                            <div className="right-icons">
                                <div>
                                    <img className="downvote" src={downvote_unselected} alt="downvote"/>
                                </div>
                                <div>
                                    <img className="downvote" src={fb} alt="fb"/>
                                </div>
                                <div>
                                    <img className="downvote" src={twitter} alt="twitter"/> 
                                </div>
                                <div>
                                    <img className="downvote" src={share} alt="share"/>
                                </div>
                                <div>
                                    <img className="downvote" src={dots} alt="more"/>   
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
        } else {
            allQuestions = <div className="noSearchValue">Sorry! We couldn't find any results for '{this.props.match.params.searchValue}'</div>
        }
        return (
            <div>
                <Header></Header>
                <div className="container-wrapper">
                    <div className="search-sidebar">
                        <div className="search-title">By Type</div>
                        <ul className="search-ul">
                            <div className="search-questions search-div search-div-bg">
                                <li className="search-item">Questions</li>
                            </div>
                            <Link to={"/quora/search/profiles/"+this.props.match.params.searchValue}>
                                <div className="search-profiles search-div">
                                    <li className="search-item">Profiles</li>
                                </div>
                            </Link>
                            <Link to={"/quora/search/topics/"+this.props.match.params.searchValue}>
                                <div className="search-topics search-div">
                                    <li className="search-item">Topics</li>
                                </div>
                            </Link>
                        </ul>
                    </div>
                    <div className="content-wrapper">
                        <div className="question-header">
                            <h2 className="questn-title">Questions for <span className="question-value">{this.props.match.params.searchValue}</span></h2>
                        </div>
                        {allQuestions}
                        <div className="row">
                            <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={this.state.num_pages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchQuestions);