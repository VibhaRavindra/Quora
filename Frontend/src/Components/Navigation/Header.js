    
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

class Header extends Component {
  constructor(props){
        super(props);
        this.state={
            value:[],
            open:false,
            rows:[],
            searchValue: null,
            contentClick: false
        }
        this.onSearchEnter = this.onSearchEnter.bind(this);
    }
    onSearchEnter = (event) => {
        if(event.key === 'Enter'){
        this.setState({searchValue: event.target.value})
        }
    }
    componentDidMount(){
        var data={
            "user_name":localStorage.getItem("user_name")
        }
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post("http://"+rooturl+":3001/quora/notifications",data, localStorage.getItem('jwtToken'))
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
        let noti=[];
        noti.push(<ul className="ulclass"> <a href="/quora/SeeAllNotifications">See all Notifications</a>{
            this.state.rows.map(member=><li className="liclass">  <img src={abc} width="40" height="40" alt="abc"/><b>{member.answeredby}</b>,{member.answeredby_tagline}, answered : <span className="question-notification">{member.question}</span><span className="timestamp-notification">  {member.timestamp}</span></li>)} 
        </ul>  )
        let redirect = null;
        if (this.state.searchValue != null){
            redirect = <Redirect to={'/quora/search/questions/'+this.state.searchValue} />
        }
      
    return (
        <div className="row">
            {redirect}
            <div className="header" >
                <div>
                    <img className="quora-logo" src={Logo} alt="Quora"/>
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
                    <div className="profile-logo" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="sr-only">Toggle Dropdown</span>
                    </div>
                    <div class="dropdown-menu dropdown-menu-profile">
                        <a class="dropdown-item-profile" href="/quora/myprofile">Profile</a>
                        <a class="dropdown-item-profile" href="#" data-toggle="modal" data-target="#messageList">Messages</a>
                        <a class="dropdown-item-profile" href="/quora/content/questions_asked">Your Content</a>
                        <a class="dropdown-item-profile" href="settings">Settings</a>
                        <a class="dropdown-item-profile" href="#">Logout</a>
                    </div>
                    <MessageList />
                </div>
                <div>
                    <div className="add-question" data-toggle="modal" data-target="#askQuestion">Add Question or Link</div>
                    <AskQuestion/>
                </div>
              
          </div>

      </div>



    );
  }
}

export default Header;