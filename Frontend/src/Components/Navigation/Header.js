import React, { Component } from 'react';
import '../../Styles/Navigation.css';
import Logo from '../../Images/quora.svg';
import {Link} from 'react-router-dom'
import abc from './abc.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import {rooturl} from '../../Config/settings'
class Header extends Component {
  constructor(props){
    super(props);
    this.state={
        value:[],
        open:false,
        rows:[],

       
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
       noti.push(<ul> <a href="/quora/SeeAllNotifications">See all Notifications</a>{
        this.state.rows.map(member=><li>  <img src={abc} width="40" height="40" /><b>{member.answeredby}</b>,{member.answeredby_tagline}, answered : <span className="question-notification">{member.question}</span><span className="timestamp-notification">  {member.timestamp}</span></li>)} 
       </ul>  )
      
    return (
     
      <div className="row">
          <div className="header" >
              <div>
                <img className="quora-logo" src={Logo} alt="Quora"/>
              </div>
              <div className="header-elem home">
                <div className="header-logo-text home-elem">Home</div>
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
                <input className="search-box" placeholder="Search Quora"></input>
              </div>
              <div className="profile">
              <div className="profile-logo" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="sr-only">Toggle Dropdown</span>
                </div>
                <div class="dropdown-menu">
                    <a class="dropdown-item" href="/profile">Profile</a>
                    <a class="dropdown-item" href="/messages">Messages</a>
                    <a class="dropdown-item" href="/yourcontent">Your Content</a>
                    <a class="dropdown-item" href="settings">Settings</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#">Logout</a>
                </div>
              </div>
              <div>
                <div className="add-question">Add Question or Link</div>
              </div>
              
          </div>

      </div>



    );
  }
}

export default Header;
