import React, { Component } from 'react';
import '../../Styles/Search.css';
import Header from '../Navigation/Header';
import { Redirect, Link } from "react-router-dom";
import followTopic from '../../Images/follow-topic-icon.svg';
// import Technology from '../../Images/Technology.png';
// import Science from '../../Images/follow-topic-icon.svg';
// import Music from '../../Images/follow-topic-icon.svg';
// import Sports from '../../Images/follow-topic-icon.svg';
// import Health from '../../Images/follow-topic-icon.svg';

class SearchQuestions extends Component {
    constructor(props){
        super(props);
        this.state = {
            topics: []
        }
    }
    async componentDidMount(){
        const getTopicsDetails = await fetch('/search/topics/'+this.props.match.params.searchValue, {
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const getTopics = await getTopicsDetails.json();
        this.setState({
            topics : getTopics.topics_array
        });
    }
    render() {
        let allTopics;
        console.log("this.state.topics.length : "+ this.state.topics.length)
        if(this.state.topics.length > 0){
            allTopics = this.state.topics.map(topic => {      
                console.log(topic.career);
                let topicurl = "/quora/topic/"+topic.name.toLowerCase();
                let img = topic.name;
                return(
                    
                    <div className="question-container">
                        {/* <Link to={} ></Link> */}
                        <div className="profile-header">
                            <img className="topic-img" src={require('../../Images/'+topic.name+'.png')} alt={topic.name}></img>
                            <span className="profile-text">Topic: </span>
                            <Link to={topicurl}>
                                <span className="question-text">{topic.name}</span>
                            </Link>
                        </div>
                        <div className="row question-row">
                            <div className="follow-question">
                                <img className="follow-logo" src={followTopic} alt="follow"/>
                                <span className="follow-text">Follow</span>
                                <span className="numFollowers">{topic.num_of_followers}</span>
                            </div>
                        </div>
                    </div>
                )
            })
        } else {
            allTopics = <div className="noSearchValue">Sorry! We couldn't find any results for '{this.props.match.params.searchValue}'</div>
        }
        return (
            <div>
                <Header></Header>
                <div className="container-wrapper">
                    <div className="search-sidebar">
                        <div className="search-title">By Type</div>
                        <ul className="search-ul">
                            <Link to={"/quora/search/questions/"+this.props.match.params.searchValue}>
                                <div className="search-questions search-div">
                                    <li className="search-item">Questions</li>
                                </div>
                            </Link>
                            <Link to={"/quora/search/profiles/"+this.props.match.params.searchValue}>
                                <div className="search-profiles search-div">
                                    <li className="search-item">Profiles</li>
                                </div>
                            </Link>
                            <div className="search-topics search-div search-div-bg">
                                <li className="search-item">Topics</li>
                            </div>
                        </ul>
                    </div>
                    <div className="content-wrapper">
                        <div className="question-header">
                            <h2 className="questn-title">Topics for <span className="question-value">{this.props.match.params.searchValue}</span></h2>
                        </div>
                        {allTopics}
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchQuestions;