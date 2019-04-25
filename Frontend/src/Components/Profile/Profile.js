import React, { Component } from 'react';
import Header from '../Navigation/Header';
import { Nav, Tab, Col, Row } from 'react-bootstrap';
import '../../Styles/Home.css';
import '../../Styles/Profile.css';
import { Link } from "react-router-dom";
import abc from './abc.png';
import axios from 'axios'
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultImg: false,
            questions: [],
            taglinepop:[],
            selectedFile: null,
             loaded: 0
        }
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
componentDidMount=()=>{
    localStorage.setItem('cookie2',"Kavya Sri Chennoju");
    localStorage.setItem('cookie3',"RedBird");
    localStorage.setItem('cookie4',"abc.jpg");
}
handleUpload = () => {
    const data = new FormData()
    data.append('selectedFile', this.state.selectedFile, this.state.selectedFile.name)
    axios
      .post('http://localhost:3001/quora/addprofilepic', data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
          })
        },
      })
      .then(res => {
        console.log(res.statusText)
      })


  }
  
    render() {
     
        return (
            <div>
           
            <div style={{ background: "#fafafa", height: "100vh" }}>
         
                <Header />
                {this.state.taglinepop}
<div className="profile-pic" >
           <img src={abc} width="120" height="120" /> <div className="upload-propic">
           <input type="file" name="" id="p" onChange={this.handleselectedFile} />
        <button onClick={this.handleUpload}>Upload</button>
        <div> {Math.round(this.state.loaded, 2)} %</div></div><span className="info"><b>{localStorage.getItem('cookie2')}</b></span><br /><span className="tagline-profile" onClick={this.taglinepopup}>Add Profile Credential</span><br />
            
                </div>
                <span className="credentials-profile">Credentials & Highlights</span> <hr className="credential-hr"/> <span className="credentials-profile-add">Add employment credential<br />
Add education credential<br />
Add a location credential</span><br />
              
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
Followers <br />
Following <br />
Edits<br />
Activity<br />
                                            </Nav>
                                        </Col>
                                        <Col sm={9}>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="first">
                                                    <div id="accordion">
                                                      Profile<hr className="profile-hr"/> 
                                                      
                                                    </div>
                                                </Tab.Pane>
                                            </Tab.Content>
                                            
                                        </Col>
                                      <Col sm={13} id="right-tab">
                                      Knows About
                                 
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