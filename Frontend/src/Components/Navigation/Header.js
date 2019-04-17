import React, { Component } from 'react';
import '../../Styles/Navigation.css';
import Logo from '../../Images/quora.svg';

class Header extends Component {
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
                <div className="header-logo-text notifications-elem">Notifications</div>
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
