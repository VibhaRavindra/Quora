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
import AddDescription from './AddDescription';
import {rooturl} from '../../Config/settings'
var hex64 = require('hex64');
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
    
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
             profiletab:true,
             followingrows:"",
             followerscount:"",
             followingcount:"",
             aboutme:""
        }
        this.showfollowers=this.showfollowers.bind(this);
        this.updatetaglinevalue=this.updatetaglinevalue.bind(this);
        this.updateemploymentvalue=this.updateemploymentvalue.bind(this);
        this.updateeducationvalue=this.updateeducationvalue.bind(this);
        this.showfollowing=this.showfollowing.bind(this);
        this.updatelocationvalue=this.updatelocationvalue.bind(this);
        this.updatedescriptionvalue=this.updatedescriptionvalue.bind(this);
        this.showprofile=this.showprofile.bind(this);
      
    }

    handleselectedFile = event => {
        this.setState({
          selectedFile: event.target.files[0],
          loaded: 0,
        })
      }


  

componentWillMount=()=>{
   
console.log("username from localstorage is",localStorage.getItem("user_name"))
    var data={
        "user_name":localStorage.getItem("user_name")
      }
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.get("http://"+rooturl+":3001/quora/getprofileinfo",{params:data}, localStorage.getItem('jwtToken'))
              .then(response => {
              
        console.log("Status Code : ",response.status);
        if(response.status === 200){
            console.log(response.data);
            this.setState({
                rows : response.data,
            })
        }
        this.setState({tagline:this.state.rows.user_tagline,employment:this.state.rows.career,education:this.state.rows.education,followers:this.state.rows.users_followers,following:this.state.rows.users_following,profilepic:this.state.rows.b64,location:this.state.rows.state,aboutme:this.state.rows.aboutme})
    if(this.state.profilepic==="" || this.state.profilepic===null || this.state.profilepic==="undefined")
    {
        this.setState({profilepic:abc})
    }
    })
      .catch()

      if(this.state.followers!=null){
        this.setState({followerscount:this.state.followers.length})}
               
       if(this.state.following!=null){
        this.setState({followingcount:this.state.following.length})}



  }

handleUpload = () => {
 
    console.log(localStorage.getItem("user_name"))
   
    const data = new FormData()
    data.append("user_name",localStorage.getItem("user_name") );
    data.append('selectedFile', this.state.selectedFile, this.state.selectedFile.name)
    console.log(this.state.selectedFile)
  data.set("user_name",localStorage.getItem("user_name"))
    axios
      .post('http://'+rooturl+':3001/quora/addprofilepic', data)
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
updatedescriptionvalue(x){
    console.log("updating")
    console.log(x)
    this.setState({aboutme:x})

}
showfollowers(){
    this.setState({followerstab:true,followingtab:false,profiletab:false})
    var data={
      "user_name":localStorage.getItem("user_name")
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
        "user_name":localStorage.getItem("user_name")
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
     
    let defaultprofilepic=[],actualprofilepic=[];
    defaultprofilepic.push(<div>
         <img src={abc} width="120" height="120" /><br />
           <input type="file" name="" id="p" onChange={this.handleselectedFile} />
               <button onClick={this.handleUpload}>Upload</button>
        <div> {Math.round(this.state.loaded, 2)} %</div></div>
    );
    actualprofilepic.push(
        <div>
        {localStorage.setItem("b64",this.state.profilepic)}
         <img src={this.state.profilepic} width="120" height="120" /><br />
           <input type="file" name="" id="p" onChange={this.handleselectedFile} />
               <button onClick={this.handleUpload}>Upload</button>
        <div> {Math.round(this.state.loaded, 2)} %</div></div>        
    )
  
        console.log("tagline now is"+this.state.employment)
        let followersdisplay=[],x="",followingdisplay=[],y="";
        if(this.state.followerstab===true && this.state.followingtab===false)
        for(x in this.state.followersrows)
        followersdisplay.push(<div id="followers-elem">
        {this.state.followersrows[x].b64==null ||this.state.followersrows[x].b64==undefined || this.state.followersrows[x].b64=="" || this.state.followersrows[x].b64=="default" ?
        <img src={abc} width="40" height="40"/>
        :
        <img src={this.state.followersrows[x].b64} width="40" height="40"/>}

      {this.state.followersrows[x].user_name!=localStorage.getItem("user_name") ?
        <Link className="question-link" to={"/quora/profile/" + this.state.followersrows[x].user_name}>
        <b>{this.state.followersrows[x].firstname}{"  "}{this.state.followersrows[x].lastname}</b>
        </Link>
        :
        <Link className="question-link" to={"/quora/myprofile"}>
        <b>{this.state.followersrows[x].firstname}{"  "}{this.state.followersrows[x].lastname}</b>
        </Link>
        
      }
        
        
        <br />
        {this.state.followersrows[x].user_tagline}</div>)
        if(this.state.followerstab===false && this.state.followingtab===true){
      
         for(y in this.state.followingrows){
         console.log("hello",this.state.followingrows[y].firstname)
         followingdisplay.push(
         <div id="followers-elem">
         {this.state.followingrows[y].b64==null ||this.state.followingrows[y].b64==undefined || this.state.followingrows[y].b64=="" || this.state.followingrows[y].b64=="default" ?
         <img src={abc} width="40" height="40"/>
         :
         <img src={this.state.followingrows[y].b64} width="40" height="40"/>
         }




     {this.state.followingrows[y].user_name!=localStorage.getItem("user_name") ?
         <Link className="question-link" to={"/quora/profile/" + this.state.followingrows[y].user_name}>
         <b>{this.state.followingrows[y].firstname}{"  "}{this.state.followingrows[y].lastname}</b>
         </Link>
         :
         <Link className="question-link" to={"/quora/myprofile"}>
         <b>{this.state.followingrows[y].firstname}{"  "}{this.state.followingrows[y].lastname}</b>
         </Link>
         
     }     
         
         
         
         <br />{this.state.followingrows[y].user_tagline}</div>
         )
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
          
<div className="upload-propic">
                
   {this.state.profilepic===null || this.state.profilepic ===undefined || this.state.profilepic === "" ||  this.state.profilepic === "default" ?
   defaultprofilepic:actualprofilepic}

        
        
        </div>
        <br />
        <span className="info">
        <b>{localStorage.getItem("fullname")}</b>
        </span><br />
        {this.state.tagline==="" || this.state.tagline===null || this.state.tagline===undefined ? 
        <span className="tagline-profile" data-toggle="modal" data-target="#tagline">
        Add Profile Credential
        </span>
        :
        <span className="tagline-profile" data-toggle="modal" data-target="#tagline">
        {localStorage.setItem("tagline",this.state.tagline)}
        {
            console.log(this.state.tagline)}{this.state.tagline}
            <br />
        </span>
        }<AddTagline triggertagline={this.updatetaglinevalue}/> <br />


      
       

        {this.state.aboutme==="" || this.state.aboutme===null || this.state.aboutme===undefined  ? 
                <span className="description-profile" data-toggle="modal" data-target="#description">
                
                Add Description
                </span> :  <span  className="description-profile" data-toggle="modal" data-target="#description">
                
                {this.state.aboutme}
                </span>}
                
                <AddDescription triggerdescription={this.updatedescriptionvalue}/><br />














            
        </div>
    <span className="credentials-profile">Credentials & Highlights</span>
    <hr className="credential-hr"/> 
    <span className="credentials-profile-add">
    {this.state.employment==="" || this.state.employment===null || this.state.employment===undefined ? <span data-toggle="modal" data-target="#employment">
    Add employment credential</span>:
    <span data-toggle="modal" data-target="#employment">{console.log(this.state.employment)}{this.state.employment}</span>}
    <AddEmployment triggeremployment={this.updateemploymentvalue}/><br />
    {this.state.education==="" || this.state.education===null || this.state.education===undefined  ? 
                <span data-toggle="modal" data-target="#education">
                
                Add education credential
                </span> :  <span data-toggle="modal" data-target="#education">
                
                {this.state.education}
                </span>}
                
                <AddEducation triggereducation={this.updateeducationvalue}/><br />
                
                {this.state.location==="" || this.state.location===null || this.state.location===undefined  ? 
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
                                              
                                      
<b>Feeds</b>
<div onClick={this.showprofile}>Profile<br /></div>


<div onClick={this.showfollowers}>Followers{this.state.followers != null || this.state.followers != undefined || this.state.followers !=null ? <span>{this.state.followers.length}</span> : <span>0</span>}</div>

<div onClick={this.showfollowing}>Following {this.state.following != null || this.state.following != undefined || this.state.following !=null ? <span>{this.state.following.length}</span> : <span>0</span>}</div>

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
