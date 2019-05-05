import React, { Component } from 'react';
import '../../Styles/Search.css';
import Header from '../Navigation/Header';
import { Link } from "react-router-dom";
import followTopic from '../../Images/follow-topic-icon.svg';
//for pagination
import ReactPaginate from 'react-paginate';
import following from '../../Images/following-topic-icon.svg';
import axios from 'axios'
import {rooturl} from '../../Config/settings'

class SearchQuestions extends Component {
    constructor(props){
        super(props);
        this.state = {
            follow:false,
            topics: [],
            //for pagination
            paginated_topics:[],
            results_per_page: 2,
            num_pages:0,
            inc:[]
        }
   //for pagination
   this.handlePageClick = this.handlePageClick.bind(this);
   this.unfollowtopic=this.unfollowtopic.bind(this);
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
        var inc={}
        this.state.topics.map(member=>
          
            inc[member.name]=member.num_of_followers             
         
            )

   this.setState({inc:inc}) 
    }
    unfollowtopic=(e,x)=>{
        this.setState({follow:false})
        var newinc=this.state.inc
        newinc[x]=newinc[x]-1;
        this.setState({inc:newinc})
     e.preventDefault();
 
        let topicsArr=localStorage.getItem("topics")
        
        console.log("hooorah",topicsArr.replace(x,""),"happy",x);
        let newtopicsArr=[];
       newtopicsArr=topicsArr.split(",");
       var index = newtopicsArr.indexOf(x);
 if (index > -1) {
  newtopicsArr.splice(index, 1);
 }
       localStorage.setItem("topics", newtopicsArr);
        
     
        var data={
            user_name:localStorage.getItem("user_name"),
            topicname:x
        }
        axios.post("http://"+rooturl+":3001/quora/unfollowtopic",data, localStorage.getItem('jwtToken'))
     }

     
     followtopic=(e,x)=>{
        this.setState({follow:true})
        var newinc=this.state.inc
        newinc[x]=newinc[x]+1;
        this.setState({inc:newinc})
        e.preventDefault();
        let topicsArr=localStorage.getItem("topics")
        let newtopicsArr=[];
       newtopicsArr=topicsArr.split(","); 
       newtopicsArr.push(x);
       localStorage.setItem("topics", newtopicsArr);
        console.log(localStorage.getItem("topics"),"hello")

        var data={
            user_name:localStorage.getItem("user_name"),
            topicname:x
        }
        axios.post("http://"+rooturl+":3001/quora/followtopic",data, localStorage.getItem('jwtToken'))
     }
  
 
    render() {
        let allTopics;
        console.log(this.state.topics,"yayyymytopic")
        if(this.state.topics.length > 0){
            allTopics = this.state.paginated_topics.map(topic => {      
                console.log(topic.career);
              
                let img = topic.name;
                return(
                    
                    <div className="question-container">
                        {/* <Link to={} ></Link> */}
                        <div className="profile-header">
                            <img className="topic-img" src={require('../../Images/'+topic.name+'.png')} alt={topic.name}></img>
                            <span className="profile-text">Topic: </span>
                            {/* <Link to={topicurl}> */}
                                <span className="question-text">{topic.name}</span>
                            {/* </Link> */}
                        </div>
                        <div className="row question-row">
                           
                           {
                               localStorage.getItem("topics").split(",").includes(topic.name)===false ?
                               
                           <div className="follow-question" onClick={(e)=>this.followtopic(e,topic.name)}>
                                    <img className="follow-logo" src={followTopic} alt="follow"/>
                                <span className="follow-text">Follow</span>
                                <span className="numFollowers">{this.state.inc[topic.name]}</span>
                            </div>
                            :
                            <div className="follow-question" onClick={(e)=>this.unfollowtopic(e,topic.name)}>
                                <img className="follow-logo" src={following} alt="follow"/>
                                <span className="follow-text">Follow</span>
                                <span className="numFollowers">{this.state.inc[topic.name]}</span>
                            </div>
                            }
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