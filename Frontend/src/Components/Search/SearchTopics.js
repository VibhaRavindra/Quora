import React, { Component } from 'react';
import '../../Styles/Search.css';
import Header from '../Navigation/Header';
import { Redirect, Link } from "react-router-dom";
import followTopic from '../../Images/follow-topic-icon.svg';
//for pagination
import ReactPaginate from 'react-paginate';

class SearchQuestions extends Component {
    constructor(props){
        super(props);
        this.state = {
            topics: [],
            //for pagination
            paginated_topics:[],
            results_per_page: 2,
            num_pages:0
        }
   //for pagination
   this.handlePageClick = this.handlePageClick.bind(this);
}

//for pagination
handlePageClick(data){
    console.log(data.selected)
    let page_number = data.selected;
    let offset = Math.ceil(page_number * this.state.results_per_page)
    this.setState({
        paginated_topics : this.state.topics.slice(offset, offset +this.state.results_per_page)
    })
}
    async componentDidMount(){
        const getTopicsDetails = await fetch('/search/topics/'+this.props.match.params.searchValue, {
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const getTopics = await getTopicsDetails.json();
        // for pagination
        const all_topics = getTopics.topics_array
        const pages = Math.ceil(all_topics.length/this.state.results_per_page)
        this.setState({
            topics : all_topics,
            num_pages:pages,
            paginated_topics: all_topics.slice(0,this.state.results_per_page),
        });
    }
    render() {
        let allTopics;
        console.log("this.state.topics.length : "+ this.state.topics.length)
        if(this.state.topics.length > 0){
            allTopics = this.state.paginated_topics.map(topic => {      
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

export default SearchQuestions;