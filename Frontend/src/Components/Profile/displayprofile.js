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
             followingrows:"",
             followerscount:0,
             followingcount:0,
             isfollowing:false,
        }
        this.showfollowers=this.showfollowers.bind(this);
        this.showfollowing=this.showfollowing.bind(this);
        this.followuser=this.followuser.bind(this);
    }

componentWillMount=()=>{
    var data={
        "user_name":"vibhashree.ravindra@sjsu.edu"
      }
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.post("http://localhost:3001/quora/getprofileinfo",data, localStorage.getItem('jwtToken'))
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
        
        if(this.state.followers.length>0){
        this.setState({followerscount:this.state.followers.length})
       if(this.state.followers.includes("kavya.chennoju@sjsu.edu"))
       this.setState({isfollowing:true})
    }
    })
      .catch()
  }
followuser=()=>{
    localStorage.setItem("user_name","kavya.chennoju@sjsu.edu")
    this.setState({followerscount:this.state.followerscount+1,isfollowing:true})
    var data={
        "user_name":localStorage.getItem("user_name"),
        "follow_user_name":"vibhashree.ravindra@sjsu.edu"
    }

    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post("http://localhost:3001/quora/followuser",data, localStorage.getItem('jwtToken'))
            .then(response => {
            
      console.log("Status Code : ",response.status);
      if(response.status === 200){
          console.log(response.data);
      }
  })
    .catch()
}

unfollowuser=()=>{
    localStorage.setItem("user_name","kavya.chennoju@sjsu.edu")
    this.setState({followerscount:this.state.followerscount-1,isfollowing:false})
    var data={
        "user_name":localStorage.getItem("user_name"),
        "unfollow_user_name":"vibhashree.ravindra@sjsu.edu"
    }

    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post("http://localhost:3001/quora/unfollowuser",data, localStorage.getItem('jwtToken'))
            .then(response => {
            
      console.log("Status Code : ",response.status);
      if(response.status === 200){
          console.log(response.data);
      }
  })
    .catch()
}
showfollowers(){
    this.setState({followerstab:true,followingtab:false})
    var data={
      "user_name":"vibhashree.ravindra@sjsu.edu"
      }
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.post("http://localhost:3001/quora/getfollowersinfo",data, localStorage.getItem('jwtToken'))
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
    this.setState({followingtab:true,followerstab:false})
    var data={
        "user_name":"vibhashree.ravindra@sjsu.edu"
      }
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.post("http://localhost:3001/quora/getfollowinginfo",data, localStorage.getItem('jwtToken'))
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
 
    render() {
    
     console.log("tagline now is"+this.state.tagline)
   let followersdisplay=[],x="",followingdisplay=[],y="";
   if(this.state.followerstab===true && this.state.followingtab===false)
   for(x in this.state.followersrows)
   followersdisplay.push(<div id="followers-elem"><img src={this.state.followersrows[x].b64} width="40" height="40"/><b>{this.state.followersrows[x].firstname}{"  "}{this.state.followersrows[x].lastname}</b><br />{this.state.followersrows[x].user_tagline}</div>)
   if(this.state.followerstab===false && this.state.followingtab===true){
 
    for(y in this.state.followingrows){
    console.log("hello",this.state.followingrows[y].firstname)
    followingdisplay.push(<div id="followers-elem"><img src={this.state.followingrows[y].b64} width="40" height="40"/><b>{this.state.followingrows[y].firstname}{"  "}{this.state.followingrows[y].lastname}</b><br />{this.state.followingrows[y].user_tagline}</div>)
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
           <img src={this.state.profilepic} width="120" height="120" /> <div className="upload-propic">
          </div>
        <br />
        <span className="info">
        <b>{this.state.name}</b>
        </span><br />
       
        <span className="tagline-profile" data-toggle="modal" data-target="#askQuestion">
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
 <span data-toggle="modal" data-target="#location">
 Add a location credential
 </span>
 <AddLocation/></span><br />
              
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
                                              
                                      
Feeds<br />
Profile<br />
Answers<br />
Questions<br />
Shares<br />
Spaces<br />
Posts<br />
Blogs<br />
<div onClick={this.showfollowers}>Followers {this.state.followerscount}</div>
<div onClick={this.showfollowing}>Following {this.state.following.length}</div>
Edits<br />
Activity<br />
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

export default displayprofile;