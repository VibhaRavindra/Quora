import React, { Component } from 'react';
import '../../Styles/Navigation.css';
import Logo from '../../Images/quora.svg';
import Notifications from '../Notifications/Notifications';
import {Link} from 'react-router-dom'
import abc from './abc.png'
class Header extends Component {
  constructor(props){
    super(props);
    this.state={
        value:[],
        open:false,
        questions:[],

       
    }
this.updatevalue=this.updatevalue.bind(this);
this.openNotification=this.openNotification.bind(this);
    }
    updatevalue(x){
      console.log("updating")
      this.setState({
        value : (x),
    })
   
    var arr=JSON.parse(this.state.value)
    arr.map(member=>{this.setState({names:this.state.questions.push({"questions":member.question,"answeredby":member.answeredby,"answeredby_tagline":member.answeredby_tagline,"answeredby_profile_pic":member.answeredby_profile_pic,"timestamp":member.timestamp_answer})})})
    


    }
   

    openNotification = () => {
      this.setState(state => {
        return {
          open: !state.open,
        };
      });
    };

  render() {
     
    return (
     
      <div className="row">
          <div className="header">
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
             
              <div className="header-elem notifications">
                <div className="header-logo-text notifications-elem" onClick={this.openNotification}>Notifications</div>
                <Notifications triggerupdate={this.updatevalue} />
                <div>
              </div>
                <div>  <span class="notifications-elem__badge">{this.state.questions.length}</span> </div>
                <div className="notifications-box">
                {this.state.open && (
            <div className="notifications-elem_dropdowncontents">
            <div className="head_notification_dropdown"><Link to='/SeeAllNotifications'>See all notifications</Link> <span className="read-notifications"> Mark these as read</span></div>
            <ul>  {
              this.state.questions.map(member=><li>  <img src={abc} width="40" height="40" /><b>{member.answeredby}</b>,{member.answeredby_tagline}, answered : <span className="question-notification">{member.questions}</span><span className="timestamp-notification">  {member.timestamp}</span></li>)} 
              </ul>
            </div>
          )}
          </div>
  
              
              </div>
              <div>
                <input className="search-box" placeholder="Search Quora"></input>
              </div>
              <div className="profile">
                <div className="profile-logo"></div>
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
