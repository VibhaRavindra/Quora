import React, { Component } from 'react';
import '../../Styles/Search.css';
import Header from '../Navigation/Header';
import { signup, signin } from "../../js/actions/action";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import notify from '../../Images/profile-notify.svg';
import followPerson from '../../Images/follow-person.svg';
//for pagination
import ReactPaginate from 'react-paginate';

import axios from 'axios';
import {rooturl} from '../../Config/settings'
import unfollowuser from './unfollowuser.png'
class SearchQuestions extends Component {
    constructor(props){
        super(props);
        this.state = {
            profiles: [],
        //for pagination
        paginated_profiles:[],
        results_per_page: 2,
        num_pages:0,status:[],
        inc:[]
    }
    //for pagination
    this.handlePageClick = this.handlePageClick.bind(this);
    this.followssuser=this.followssuser.bind(this);
    this.unfollowuser=this.unfollowuser.bind(this);
}

//for pagination
handlePageClick(data){
console.log(data.selected)
let page_number = data.selected;
let offset = Math.ceil(page_number * this.state.results_per_page)
this.setState({
    paginated_profiles : this.state.profiles.slice(offset, offset +this.state.results_per_page)
})
}
            

    
  unfollowuser(e,x){
      e.preventDefault();
        var newstatus=this.state.status;
        newstatus[x]=false;
        console.log(newstatus,"eve new un")
        var newinc=this.state.inc
        newinc[x]=newinc[x]-1;
        this.setState({status:newstatus,inc:newinc})
            var data={
                "user_name":localStorage.getItem("user_name"),
                "unfollow_user_name":x
            }
        
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post("http://"+rooturl+":3001/quora/unfollowuser",data, localStorage.getItem('jwtToken'))
                    .then(response => {
                    
              console.log("Status Code : ",response.status);
              if(response.status === 200){
                  console.log(response.data);
    
              }
          })
            .catch()
        }
      followssuser(e,x){
        e.preventDefault();
            var newstatus=this.state.status;
            newstatus[x]=true;
            console.log(newstatus,"eve new fo")
            var newinc=this.state.inc
            newinc[x]=newinc[x]+1;
         
            this.setState({status:newstatus,inc:newinc})
            var data={
                "user_name":localStorage.getItem("user_name"),
                "follow_user_name":x
            }
        
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post("http://"+rooturl+":3001/quora/followuser",data, localStorage.getItem('jwtToken'))
                    .then(response => {
                    
              console.log("Status Code : ",response.status);
              if(response.status === 200){
                  console.log(response.data);
              }
          })
            .catch()
        }





    async componentDidMount(){
        const getProfilesDetails = await fetch('/search/profiles/'+this.props.match.params.searchValue, {
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const getProfiles = await getProfilesDetails.json();
        // for pagination
        const all_profiles = getProfiles.profiles_array
        const pages = Math.ceil(all_profiles.length/this.state.results_per_page)
        this.setState({
            profiles : all_profiles,
            num_pages:pages,
            paginated_profiles: all_profiles.slice(0,this.state.results_per_page),
        });
        this.setState({
            profiles : getProfiles.profiles_array
        });
        var status={},inc={};
        this.state.profiles.map(member=>
          
            
            member.followers.includes(localStorage.getItem("user_name")) ? status[member.user_name]=true
            :
            status[member.user_name]=false
            )
            this.state.profiles.map(member=>
          inc[member.user_name]=member.num_of_followers
           
                )
            console.log(status,"hiphop")

       this.setState({status:status,inc:inc})     
    }




    render() {
        let allProfiles
        if(this.state.profiles.length > 0){
            allProfiles = this.state.paginated_profiles.map(profile => {      
                console.log(profile.career);
                return(
                    <div className="question-container">
                        {/* <Link to={} ></Link> */}

                        <div className="profile-header">
                        <img src={"/search/getRawImage?userid="+ profile.profile_id} className="profile-search-pic" />
                            <span className="profile-text">Profile: </span>
                            <Link to={"/quora/profile/"+profile.user_name}>
                                <span className="question-text">{profile.firstname}  {profile.lastname}</span>
                            </Link>
                            <span className="profile-text">, {profile.career}  </span>
                        </div>
                        <div className="profile-aboutme">{profile.aboutme}</div>
                        <div className="row question-row">
                           { this.state.status[profile.user_name]== false ?
                               <div className="follow-question" onClick={(e)=>this.followssuser(e,profile.user_name)}>
                                <img className="follow-logo" src={followPerson} />
                                <span className="follow-text" >Follow</span>
                                <span className="numFollowers">{this.state.inc[profile.user_name]}</span>
                            </div>
                            :
                            <div className="follow-question" onClick={(e)=>this.unfollowuser(e,profile.user_name)}>
                                <img className="follow-logo" src={unfollowuser} alt="follow" />
                                <span className="numFollowers">{this.state.inc[profile.user_name]}</span>
                            </div>
                            }
                            <div className="follow-question">
                                <img className="profile-notify" src={notify} alt="notify"/>
                                <span className="profile-notify">Notify Me</span>
                            </div>
                        </div>
                    </div>
                )
            })
        } else {
            allProfiles = <div className="noSearchValue">Sorry! We couldn't find any results for '{this.props.match.params.searchValue}'</div>
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
                            <div className="search-profiles search-div search-div-bg">
                                <li className="search-item">Profiles</li>
                            </div>
                            <Link to={"/quora/search/topics/"+this.props.match.params.searchValue}>
                                <div className="search-topics search-div">
                                    <li className="search-item">Topics</li>
                                </div>
                            </Link>
                        </ul>
                    </div>
                    <div className="content-wrapper">
                        <div className="question-header">
                            <h2 className="questn-title">Profiles for <span className="question-value">{this.props.match.params.searchValue}</span></h2>
                        </div>
                        {allProfiles}
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