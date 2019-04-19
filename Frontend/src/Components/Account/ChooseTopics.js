import React, { Component } from 'react';
import '../../Styles/Account.css';
import Logo from '../../Images/quora.svg';

class Header extends Component {
  render() {
    return (
        <div className="topic-container">
            <div className="topic-header row">
                <img className="topic-logo" src={Logo} alt="Quora"></img>
                <span className="topic-header-text">One Last Step</span>
            </div>
            <div className="topic-modal">
                <div className="topic-modal-header">What are your interests?</div>
                <div className="topic-list row">
                    <div className="topic-tech"></div>
                    <div className="topic-science"></div>
                    <div className="topic-music"></div>
                    <div className="topic-sports"></div>
                    <div className="topic-health"></div>
                </div>
                <button className="topic-btn">Continue</button>
            </div>
        </div>
    );
  }
}

export default Header;
