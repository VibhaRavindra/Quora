import React, { Component } from 'react';
import '../../Styles/Search.css';
import Header from '../Navigation/Header';
import { signup, signin } from "../../js/actions/action";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import notify from '../../Images/profile-notify.svg';
import followPerson from '../../Images/follow-person.svg';

class SearchQuestions extends Component {
    constructor(props){
        super(props);
        this.state = {
            profiles: []
        }
    }
    async componentDidMount(){
        const getProfilesDetails = await fetch('/search/profiles/'+this.props.match.params.searchValue, {
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const getProfiles = await getProfilesDetails.json();
        this.setState({
            profiles : getProfiles.profiles_array
        });
    }
    render() {
        let allProfiles
        if(this.state.profiles.length > 0){
            allProfiles = this.state.profiles.map(profile => {      
                console.log(profile.career);
                return(
                    <div className="question-container">
                        {/* <Link to={} ></Link> */}

                        <div className="profile-header">
                            <span className="profile-text">Profile: </span>
                            <Link to={"/quora/profile/"+profile.profile_id}>
                                <span className="question-text">{profile.firstname}  {profile.lastname}</span>
                            </Link>
                            <span className="profile-text">, {profile.career}  </span>
                        </div>
                        <div className="profile-aboutme">{profile.aboutme}</div>
                        <div className="row question-row">
                            <div className="follow-question">
                                <img className="follow-logo" src={followPerson} alt="follow"/>
                                <span className="follow-text">Follow</span>
                                <span className="numFollowers">{profile.num_of_followers}</span>
                            </div>
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
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchQuestions;