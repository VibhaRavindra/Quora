import React, { Component } from 'react';
import Header from '../Navigation/Header';
import { Nav, Tab, Col, Row } from 'react-bootstrap';
import '../../Styles/Home.css';
import '../../Styles/Profile.css';
import { Link } from "react-router-dom";
import abc from './abc.png';
import axios from 'axios';
import AddTagline from './AddTagline'
import AddEmployment from './AddEmployment';
import AddLocation from './AddLocation';
import AddEducation from './AddEducation';
import a from './a.png'
import b from './b.png'
import {rooturl} from '../../Config/settings'
//redux imports
import { connect } from 'react-redux';
import { increaseProfileView } from '../../js/actions/graph_actions';
class displayprofile extends Component {
    constructor(props) {
        super(props);
        this.state = {
             rows:[{}],
             name:"",
             tagline:"",
             profilepic:"",
             employment:"",
             education:"",
             state:"",
             followers:"",
             following:"",
             followersrows:"",
             followerstab:false,
             followingtab:false,
             profiletab:true,
             followingrows:"",
             followerscount:0,
             followingcount:0,
             isfollowing:false,
        }
        this.showfollowers=this.showfollowers.bind(this);
        this.showfollowing=this.showfollowing.bind(this);
        this.followuser=this.followuser.bind(this);
        this.showprofile=this.showprofile.bind(this);
    }

componentWillMount=async ()=>{
    var data={
        "user_name":this.props.match.params.user_id
      }
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.get("http://"+rooturl+":3001/quora/getprofileinfo",   {params:data}
      , localStorage.getItem('jwtToken'))
              .then(response => {
              
        console.log("Status Code : ",response.status);
        if(response.status === 200){
            console.log(response.data);
            this.setState({
                rows : response.data,
            })
        }
        this.setState({name:this.state.rows.firstname+" "+this.state.rows.lastname,tagline:this.state.rows.user_tagline,employment:this.state.rows.career,education:this.state.rows.education,following:this.state.rows.users_following,profilepic:this.state.rows.b64})
        
        console.log(this.state.profilepic)
        this.setState({followers:this.state.rows.users_followers})
        
        if(this.state.followers!=null){
        this.setState({followerscount:this.state.followers.length})
        
       if(this.state.followers.includes(localStorage.getItem("user_name")))
       this.setState({isfollowing:true})

       
       if(this.state.following!=null){
        this.setState({followingcount:this.state.following.length})}
    }
    })
      .catch()

 //code added by AS to add profile view count
 let profileData = null;
 var today = new Date();
 var day = today.getDate();
 var month = today.getMonth() + 1; //January is 0!
 var year = today.getFullYear();
 profileData = {"user_id":this.props.match.params.user_id,"day":day,"month":month,"year":year};
 console.log("***",profileData);
 await this.props.increaseProfileView(profileData);

  }
followuser=()=>{
   
    this.setState({followerscount:this.state.followerscount+1,isfollowing:true})
    var data={
        "user_name":localStorage.getItem("user_name"),
        "follow_user_name":this.props.match.params.user_id
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

unfollowuser=()=>{

    this.setState({followerscount:this.state.followerscount-1,isfollowing:false})
    var data={
        "user_name":localStorage.getItem("user_name"),
        "unfollow_user_name":this.props.match.params.user_id
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
showfollowers(){
    this.setState({followerstab:true,followingtab:false,profiletab:false})
    var data={
      "user_name":this.props.match.params.user_id
      }
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.post("http://"+rooturl+":3001/quora/getfollowersinfo",data, localStorage.getItem('jwtToken'))
              .then(response => {
              
        console.log("Status Code : ",response.status);
        if(response.status === 200){
            console.log(response.data);
            this.setState({
                followersrows : response.data,
            })
        }
        console.log(this.state.followersrows)
    })
      .catch()

}
showfollowing(){
    this.setState({followingtab:true,followerstab:false,profiletab:false})
    var data={
        "user_name":this.props.match.params.user_id
      }
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.post("http://"+rooturl+":3001/quora/getfollowinginfo",data, localStorage.getItem('jwtToken'))
              .then(response => {
              
        console.log("Status Code : ",response.status);
        if(response.status === 200){
            console.log(response.data);
            this.setState({
                followingrows : response.data,
            })
        }
        console.log(this.state.followingrows[0])
    })
      .catch()

}
 showprofile(){
    this.setState({followingtab:false,followerstab:false,profiletab:true})
 }
    render() {
    
     console.log("tagline now is"+this.state.tagline)

     let defaultprofilepic=[],actualprofilepic=[];
     defaultprofilepic.push(<div>
          <img src={abc} width="120" height="120" /><br />
           </div>
     );
     actualprofilepic.push(
         <div>
          <img src={this.state.profilepic} width="120" height="120" /><br />
            </div>        
     )
   
   let followersdisplay=[],x="",followingdisplay=[],y="";
   if(this.state.followerstab===true && this.state.followingtab===false)
   for(x in this.state.followersrows)
   followersdisplay.push(<div id="followers-elem">
  {this.state.followersrows[x].b64===null || this.state.followersrows[x].b64 ===undefined || this.state.followersrows[x].b64 === "" ||this.state.followersrows[x].b64 === "default"? 
  <img src={abc} width="40" height="40"/>
  :
   <img src={this.state.followersrows[x].b64} width="40" height="40"/>}
   {this.state.followersrows[x].user_name!=localStorage.getItem("user_name") ?
   <a className="question-link" href={"/quora/profile/" + this.state.followersrows[x].user_name}>
   <b>{this.state.followersrows[x].firstname}{"  "}{this.state.followersrows[x].lastname}</b>
   </a>
   :
   <a className="question-link" href={"/quora/myprofile"}>
   <b>{this.state.followersrows[x].firstname}{"  "}{this.state.followersrows[x].lastname}</b>
   </a>
   }
   
   
   
   
   
   <br />{this.state.followersrows[x].user_tagline}
   </div>
   )
   if(this.state.followerstab===false && this.state.followingtab===true){
 
    for(y in this.state.followingrows){
    console.log("hello",this.state.followingrows[y].firstname)
    followingdisplay.push(
    <div id="followers-elem">
     {this.state.followingrows[y].b64===null || this.state.followingrows[y].b64 ===undefined || this.state.followingrows[y].b64 === "" ||this.state.followingrows[y].b64 === "default"? 
     <img src={abc} width="40" height="40"/>
    :
    <img src={this.state.followingrows[y].b64} width="40" height="40"/>}{this.state.followingrows[y].user_name!=localStorage.getItem("user_name")?
    <a className="question-link" href={"/quora/profile/" + this.state.followingrows[y].user_name}>
    <b>{this.state.followingrows[y].firstname}{"  "}{this.state.followingrows[y].lastname}</b>
    </a>
    :
    <a className="question-link" href={"/quora/myprofile"}>
    <b>{this.state.followingrows[y].firstname}{"  "}{this.state.followingrows[y].lastname}</b>
    </a>
    
    }
    <br />{this.state.followingrows[y].user_tagline}</div>)
}
   }
 
   let profiledisplay=[];
  if(this.state.followerstab===false && this.state.followingtab===false)
  profiledisplay.push(<div> Profile<hr className="profile-hr"/></div> )

        return (
            <div>
           
            <div style={{ background: "#fafafa", height: "100vh" }}>
         
                <Header />
<div className="profile-pic" >
{this.state.profilepic===null || this.state.profilepic ===undefined || this.state.profilepic === "" ||this.state.profilepic === "default"?
   defaultprofilepic:actualprofilepic}
        <br />
        <span className="info">
        <b>{this.state.name}</b>
        </span><br />
       
        <span className="tagline-profile" data-toggle="modal" data-target="#tagline">
     {this.state.tagline}<br />
     {this.state.isfollowing===false?
     <div onClick={this.followuser}><img src={a} width="90" height="40" />{this.state.followerscount} </div>:<div onClick={this.unfollowuser}><img src={b} width="90" height="40" />{this.state.followerscount}</div>}
        </span>
     <br />
            
        </div>
    <span className="credentials-profile">Credentials & Highlights</span>
    <hr className="credential-hr"/> 
    <span className="credentials-profile-add">
   {this.state.employment}
 <br />
   
                {this.state.education}
               
                <br />
{this.state.state}
 </span><br />
              
                <hr />
                <br />
                <div className="row">
                    <div className="container" style={{ marginTop: "13em" }}>
                        <div className="row justify-content-center align-items-center" style={{ height: '10vh' }}>

                            <div className="col-12">
                                <Tab.Container id="left-tabs-example" defaultActiveKey="first" onSelect={this.handleSelect}>
                                    <Row>
                                        <Col sm={2}>
                                            <Nav variant="pills" className="flex-column feed-nav">
                                              
                                      
<b>Feeds</b>
<div onClick={this.showprofile}>Profile</div>

<div onClick={this.showfollowers}>Followers {this.state.followerscount}</div>
<div onClick={this.showfollowing}>Following {this.state.followingcount}</div>
                             </Nav>
                                        </Col>
                                        <Col sm={9}>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="first">
                                                    <div id="accordion">
                                                    {followersdisplay}
                                                    {followingdisplay}
                                                    {profiledisplay}
                                                     
                                                 
                                                    </div>
                                                </Tab.Pane>
                                            </Tab.Content>
                                            
                                        </Col>
                                     
                                    </Row>
                                </Tab.Container>
                           
                            </div>
                        </div>

                    </div>
                </div>
                </div>

</div>


        )
    }
}

const mapStateToProps = state => ({
    response : state.graph.payload
});

export default connect(mapStateToProps, { increaseProfileView })(displayprofile);
