import React, { Component } from 'react';
import Header from '../Navigation/Header';
import { Nav, Tab, Col, Row } from 'react-bootstrap';
import '../../Styles/SeeAllNotifications.css';
import feedImg from '../../Images/feed.png';
import { Link } from "react-router-dom";
import axios from 'axios';
import abc from './abc.png';
import {rooturl} from '../../Config/settings'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'



TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

class SeeAllNotifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultImg: false,
            rows: [{}]
        }
    }
    componentDidMount(){
        var data={
          "user_name":localStorage.getItem("user_name")
        }
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.get("http://"+rooturl+":3001/quora/notifications",{params:data}, localStorage.getItem('jwtToken'))
                .then(response => {
                
          console.log("Status Code : ",response.status);
          if(response.status === 200){
              console.log(response.data);
              this.setState({
                  rows : response.data,
              })
          }
      })
        .catch()
    }
    render() {
      

        return (
            <div style={{ background: "#fafafa", height: "100vh" }}>
                <Header />
                <div className="row">
                    <div className="container" style={{ marginTop: "5em" }}>
                        <div className="row justify-content-center align-items-center" style={{ height: '10vh' }}>

                            <div className="col-12">
                                <Tab.Container id="left-tabs-example" defaultActiveKey="first" onSelect={this.handleSelect}>
                                    <Row>
                                        <Col sm={2}>
                                            <Nav variant="pills" className="flex-column feed-nav">
                                            
                                                       
                                                            Filters
                                                            <hr /><br />
All Notifications<br />
People<br />
Answers<br />
Comments<br />
Edits<br />
Followers<br />
Posts<br />
Questions<br />
Requests<br />
Upvotes<br />
Spaces<br />
Others      <br />                                           
                                                    
                                                    
                                              
                                            </Nav>
                                        </Col>
                                        <Col sm={9}>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="first">
                                                    <div id="accordion">
                                                    Notifications<span className="read-notifications-elem"> Mark As read</span> <span className="read-notifications-elem2">Settings</span>
                                                      
                                                           
                                                        <hr />

                                                        {this.state.rows.map(member=>
                                                        
                                                        
                                        member.answeredby_profile_pic===null || member.answeredby_profile_pic===undefined || member.answeredby_profile_pic===""|| member.answeredby_profile_pic==="default"     ? 
                                        <li id="notification-single-elem">  <img src={abc} width="40" height="40" /><b>{member.answeredby}</b>,{member.answeredby_tagline}, answered : <span className="question-notification"> <Link  to={"/quora/question/" + member.qid}>{member.question}</Link></span><span className="timestamp-notification">Answered {timeAgo.format(new Date(member.timestamp_answer))}</span></li>
                                        :
                                        <li id="notification-single-elem">  <img src={member.answeredby_profile_pic} width="40" height="40" /><b>{member.answeredby}</b>,{member.answeredby_tagline}, answered : <span className="question-notification"><Link  to={"/quora/question/" + member.qid}>{member.question}</Link></span><span className="timestamp-notification"> Answered {timeAgo.format(new Date(member.timestamp_answer))} </span></li>
                                        )} 
          
        
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="second">
                                                    <div id="accordion">
                                                        {"Second tab selected"}
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
        )
    }
}

export default SeeAllNotifications;