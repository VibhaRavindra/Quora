    
import React, { Component } from 'react';
import '../../Styles/Navigation.css';
import Logo from '../../Images/quora.svg';
import {Link, Redirect} from 'react-router-dom'
import abc from './abc.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {rooturl} from '../../Config/settings';
import MessageList from '../Messages/MessageList';
import AskQuestion from '../Question/AskQuestion';
import { Modal, Button } from 'react-bootstrap';
import {signout} from "../../js/actions/action";
import { connect } from "react-redux";
import defaultProfilePic from '../../Images/profile_logo.png';
function mapStateToProps(store) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
        signout: () => dispatch(signout())
    };
}
class Header extends Component {
  constructor(props){
        super(props);
        this.state={
            value:[],
            open:false,
            rows:[],
            searchValue: null,
            contentClick: false,
            messagePopUp: false,
            deactivate: false,
            logout:false,
            messagePopUpDelete: false,
            closePopUpDelete:false,
            userImg: ''
        }
        this.onSearchEnter = this.onSearchEnter.bind(this);
        this.clickDelete = this.clickDelete.bind(this);
        this.clickDeactivate = this.clickDeactivate.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.closePopUp = this.closePopUp.bind(this); 
        this.logout = this.logout.bind(this); 
        this.closePopUpDelete = this.closePopUpDelete.bind(this); 
    }
    logout = () => {
        console.log("Inside frontend logout")
        this.props.signout();
        this.setState({
            logout: true
        })
    }
    onSearchEnter = (event) => {
        if(event.key === 'Enter'){
            this.setState({searchValue: event.target.value})
        }
    }
    clickDelete = () => {
        this.setState({messagePopUpDelete: true})
    }
    clickDeactivate = () => {
        this.setState({messagePopUp: true})
    }
    closePopUp(){
        this.setState({
            messagePopUp: false,
        });
    }
    closePopUpDelete(){
        this.setState({
            messagePopUpDelete: false,
        });
    }
    deleteAccount = async (event) => {
        event.preventDefault();
        var data = new FormData(event.target);
        console.log(data)
        var fetchedRes = await fetch("/account/delete",{
            method:"DELETE",
            body:data,
            headers:{
                'Authorization': "Bearer " + localStorage.getItem("jwtToken")
              }
        })
        var fetchedJson = await fetchedRes.json();
        if(fetchedJson.deleteSuccess) {
            localStorage.clear();
            this.setState({logout:true})
            this.props.signout();
        }
    }
    deactivateAccount = async (event) => {
        event.preventDefault();
        var data = new FormData(event.target);
        console.log(data)
        var fetchedRes = await fetch("/account/deactivate",{
            method:"POST",
            body:data,
            headers:{
                'Authorization': "Bearer " + localStorage.getItem("jwtToken")
              }
        })
        var fetchedJson = await fetchedRes.json();
        if(fetchedJson.deactivateSuccess) {
            localStorage.clear();
            this.setState({logout:true})
            this.props.signout();
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

        let userid = localStorage.getItem("userid");
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
        axios.get('/quora/profilepic?userid=' + userid)
            .then((response) => {
                if (response !== undefined)
                if (response.status === 200) {
                  
                  if(response.data.base64.length > 0) {
                    this.setState({ 
                        userImg: response.data.base64[0].b64 ,
                        user_tagline: response.data.base64[0].user_tagline 
                    });
                }
              }
        })
    }

    refreshQuestionsOnHome = () => {
        this.props.refreshQuestionsOnHome()
    }

    render() {
        let noti=[];
        noti.push(<ul className="ulclass"> <a href="/quora/SeeAllNotifications">See all Notifications</a>{
            this.state.rows.map(member=><li className="liclass">  <img src={abc} width="40" height="40" alt="abc"/><b>{member.answeredby}</b>,{member.answeredby_tagline}, answered :<Link  to={"/quora/question/" + member.qid}> <span className="question-notification">{member.question}</span></Link><span className="timestamp-notification">  {member.timestamp}</span></li>)} 
        </ul>  )
        let redirect = null;
        if (this.state.searchValue != null){
            redirect = <Redirect to={'/quora/search/questions/'+this.state.searchValue} />
        }
        if(this.state.logout)
            redirect = <Redirect to="/signup"/>

        var userImg = defaultProfilePic;
        if(this.state.userImg !== '' && this.state.userImg !== 'default') {
            userImg = this.state.userImg
        } 

        return (
        <div>
            {redirect}
            <div className="header" >
                <div>
                    <Link to="/quora/home" >
                        <img className="quora-logo" src={Logo} alt="Quora"/>
                    </Link>
                </div>
                <div className="header-elem home">
                    <Link to="/quora/home" >
                        <div className="header-logo-text home-elem">Home</div>
                    </Link>
                </div>
                <div className="header-elem answer">
                    <div className="header-logo-text answer-elem">Answer</div>
                </div>
                <div className="header-elem spaces">
                    <div className="header-logo-text spaces-elem">Spaces</div>
                </div>
                <div className="header-elem notifications" >
                    <div className="header-logo-text notifications-elem" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Notifications<span class="notifications-elem__badge">{this.state.rows.length}</span>
                        <span class="sr-only">Toggle Dropdown</span>
                    </div>
                    <div class="dropdown-menu">
                        {noti}
                    </div>
                </div>
                <div>
                    <input className="search-box" placeholder="Search Quora" onKeyDown={this.onSearchEnter}></input>
                </div>
                <div className="profile">
                    <div className="\" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img src={userImg} className="header-profile-pic" alt="profile-pic"/>
                        <span class="sr-only">Toggle Dropdown</span>
                    </div>
                    <div class="dropdown-menu dropdown-menu-profile">
                        <a class="dropdown-item-profile" href="/quora/myprofile">Profile</a>
                        <a class="dropdown-item-profile" href="#" data-toggle="modal" data-target="#messageList">Messages</a>
                        <a class="dropdown-item-profile" href="/quora/content/questions_asked">Your Content</a>
                        <a class="dropdown-item-profile" href="#" onClick={this.logout}>Logout</a>
                        <a class="dropdown-item-profile" data-toggle="modal" data-target="#delete" href="#" onClick={this.clickDelete}>Delete</a>
                        <a class="dropdown-item-profile" data-toggle="modal" data-target="#deactivate" href="#" onClick={this.clickDeactivate}>Deactivate</a>
                        <a class="dropdown-item-profile" href="/quora/AnalyticsDashboard">Analytics Dashboard</a>
                    </div>
                    <MessageList />
                </div>
                <div>
                    <div className="add-question" data-toggle="modal" data-target="#askQuestion">Add Question or Link</div>
                    <AskQuestion refreshQuestions={this.refreshQuestionsOnHome}/>
                </div>
            </div>
        <Modal className="modal-deleteAccount" id="delete" show={this.state.messagePopUpDelete} onHide={this.closePopUpDelete} aria-labelledby="contained-modal-title-vcenter" centered>
            <form onSubmit={this.deleteAccount}>
                <Modal.Header closeButton>
                    <h2 className="modal-delete-header">Enter Password</h2>
                    
                </Modal.Header>
                <Modal.Body>
                <div className="modal-below-text">For security purposes, please enter your password in order to continue. If you signed up for Quora using Facebook or Google, please create an account password.</div>
                    <div className="incorrect-delete"></div>
                    <input type="hidden" name="user_name" value={localStorage.getItem("user_name")}/>
                    <input type="password"  className="delete-pw" name="password"  placeholder="Password" />
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" className="deleteAccount-btn">
                        Done
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
        <Modal className="modal-deleteAccount"  id="deactivate" show={this.state.messagePopUp} onHide={this.closePopUp} aria-labelledby="contained-modal-title-vcenter" centered>
        <form onSubmit={this.deactivateAccount}>
            <Modal.Header closeButton>
                <h2 className="modal-delete-header">Enter Password</h2>
                
            </Modal.Header>
            <Modal.Body>
            <div className="modal-below-text">For security purposes, please enter your password in order to continue. If you signed up for Quora using Facebook or Google, please create an account password.</div>
                <div className="incorrect-delete"></div>
                <input type="hidden" name="user_name" value={localStorage.getItem("user_name")}/>
                <input type="password"  className="delete-pw" name="password"  placeholder="Password" maxlength="255" />
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit" className="deleteAccount-btn">
                    Done
                </Button>
            </Modal.Footer>
            </form>
        </Modal>
        </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);
