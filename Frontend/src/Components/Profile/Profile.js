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
var hex64 = require('hex64');
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultImg: false,
            questions: [],
            taglinepop:[],
            selectedFile: null,
             loaded: 0,
             rows:[{}],
             name:"",
             tagline:"",
             profilepic:"",
             employment:"",
             education:"",
             location:"",
             followers:"",
             following:"",
             followersrows:"",
             followerstab:false,
             followingtab:false,
             followingrows:""
        }
        this.showfollowers=this.showfollowers.bind(this);
        this.updatetaglinevalue=this.updatetaglinevalue.bind(this);
        this.updateemploymentvalue=this.updateemploymentvalue.bind(this);
        this.updateeducationvalue=this.updateeducationvalue.bind(this);
        this.showfollowing=this.showfollowing.bind(this);
        this.updatelocationvalue=this.updatelocationvalue.bind(this);
      
    }

    handleselectedFile = event => {
        this.setState({
          selectedFile: event.target.files[0],
          loaded: 0,
        })
      }


    closeDiv = (event, index) => {
        console.log(index);

        let questionsArr = this.state.questions;
        console.log(questionsArr[index].question);
        questionsArr.splice(index, 1);
        this.setState({ questions: questionsArr });
    }

componentWillMount=()=>{
    var data={
        "user_name":"kavya.chennoju@sjsu.edu"
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
        this.setState({tagline:this.state.rows.user_tagline,employment:this.state.rows.career,education:this.state.rows.education,followers:this.state.rows.users_followers,following:this.state.rows.users_following,profilepic:this.state.rows.b64})
    console.log(this.state.profilepic)
    })
      .catch()
  }

handleUpload = () => {
    localStorage.setItem("user_name","kavya.chennoju@sjsu.edu")
    console.log(localStorage.getItem("user_name"))
   
    const data = new FormData()
    data.append("user_name","kavya.chennoju@sjsu.edu" );
    data.append('selectedFile', this.state.selectedFile, this.state.selectedFile.name)
    console.log(this.state.selectedFile)
  data.set("user_name",localStorage.getItem("user_name"))
    axios
      .post('http://localhost:3001/quora/addprofilepic', data)
      .then(res => {
        this.setState({profilepic:"data:image/jpg;base64,"+res.data})
      })
  }
  updatetaglinevalue(x){
  
    this.setState({
        tagline : (x),
    })
}
updateemploymentvalue(y){
    console.log("updating employment")
    this.setState({
        employment : (y),
    })
console.log(this.state.employment)
}
updateeducationvalue(x){
    console.log("updating")
    this.setState({
        education : (x),
    })
}
updatelocationvalue(x){
    console.log("updating")
    console.log(x)
    this.setState({location:x})

}
showfollowers(){
    this.setState({followerstab:true,followingtab:false})
    var data={
      "user_name":"kavya.chennoju@sjsu.edu"
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
        "user_name":"kavya.chennoju@sjsu.edu"
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
           <input type="file" name="" id="p" onChange={this.handleselectedFile} />
        <button onClick={this.handleUpload}>Upload</button>
        <div> {Math.round(this.state.loaded, 2)} %</div></div>
        <br />
        <span className="info">
        <b>{this.state.rows.firstname}{"  "}{this.state.rows.lastname}</b>
        </span><br />
        {this.state.tagline==="" ? 
        <span className="tagline-profile" data-toggle="modal" data-target="#askQuestion">
        Add Profile Credential
        </span>
        :
        <span className="tagline-profile" data-toggle="modal" data-target="#askQuestion">
        {
            console.log(this.state.tagline)}{this.state.tagline}
        </span>
        }<AddTagline triggertagline={this.updatetaglinevalue}/> <br />
            
        </div>
    <span className="credentials-profile">Credentials & Highlights</span>
    <hr className="credential-hr"/> 
    <span className="credentials-profile-add">
    {this.state.employment==="" ? <span data-toggle="modal" data-target="#employment">
    Add employment credential</span>:
    <span data-toggle="modal" data-target="#employment">{console.log(this.state.employment)}{this.state.employment}</span>}
    <AddEmployment triggeremployment={this.updateemploymentvalue}/><br />
    {this.state.education==="" ? 
                <span data-toggle="modal" data-target="#education">
                
                Add education credential
                </span> :  <span data-toggle="modal" data-target="#education">
                
                {this.state.education}
                </span>}
                
                <AddEducation triggereducation={this.updateeducationvalue}/><br />
                
                {this.state.location==="" ? 
                <span data-toggle="modal" data-target="#location">
                
                Add location credential
                </span> :  <span data-toggle="modal" data-target="#location">
                
                {this.state.location}
                </span>}
                
 <AddLocation triggerlocation={this.updatelocationvalue}/></span><br />
              
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
<div onClick={this.showfollowers}>Followers {this.state.followers.length}</div>
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

export default Profile;