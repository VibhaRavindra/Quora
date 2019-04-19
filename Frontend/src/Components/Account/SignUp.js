import React, { Component } from 'react';
import '../../Styles/Account.css';
import Logo from '../../Images/quora.svg';

class Header extends Component {
  render() {
    return (
        <div className="account-parent-container">
        <div className="account-container">
            <div className="account-logo-container">
                <img className="quora-logo-account" src={Logo} alt="Quora"/>
            </div>          
            <p className="account-tag">A place to share knowledge and better understand the world</p>
            <div className="account-sub-container">
                <div className="signup">
                    <p className="signup-text">Sign Up</p>
                    <form className="form" onSubmit={this.submitSignUp}>
                        <div className="row">
                            <div className="first-half">
                                <label className="account-labels first-name-label">FIRST NAME</label>
                                <div className="input-firstName">
                                    <input className="first-name account-input" type="text" name="first_name" required></input>
                                </div>
                            </div>
                            <div className="second-half">
                                <label className="account-labels last-name-label">LAST NAME</label>
                                <div className="input-lastName">
                                    <input className="last-name account-input" type="text" name="last_name" required></input>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <label className="account-labels email-label">EMAIL</label>
                            <div className="input-email">
                                <input className="email account-input" type="email" name="email" required></input>
                            </div>
                        </div>
                        <div className="row">
                            <label className="account-labels email-label">PASSWORD</label>
                            <div className="input-email">
                                <input className="email account-input" type="password" name="password" required></input>
                            </div>
                        </div>
                        <div className="row">
                            <button type="submit" className="account-btn">Sign Up</button>
                        </div>
                    </form>
                </div>
                <div className="login">
                    <p className="signup-text">Login</p>
                    <form className="form" onSubmit={this.submitSignIn}>
                        <div className="row">
                            <div className="input-email">
                                <input className="email account-input" type="email" name="email" required></input>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-email">
                                <input className="email account-input email-top" type="password" name="password" required></input>
                            </div>
                        </div>
                        <div className="row">
                            <button type="submit" className="account-btn-login">Login</button>
                        </div>
                    </form>
                </div>
            </div>
      </div>
      </div>
    );
  }
}

export default Header;
