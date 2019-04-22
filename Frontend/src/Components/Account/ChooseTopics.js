import React, { Component } from 'react';
import '../../Styles/Account.css';
import Logo from '../../Images/quora.svg';

class ChooseTopics extends Component {
    constructor(props){
        super(props);
        this.state = {
            bgColor: '',
            bgImage: ''
        }
        this.clickTech = this.clickTech.bind(this);
    }
    clickTech =  () => {
        this.setState({
            bgColor: '#329bff',
            bgImage: 'url(../Images/check-white.svg)'
        })
    }
    render() {
        const bgStyle = {
            'background-color': '#329bff'
        }
        const fontStyle = {
            'color': '#fff'
        }
    return (
        <div className="topic-container">
            <div className="topic-header row">
                <img className="topic-logo" src={Logo} alt="Quora"></img>
                <span className="topic-header-text">One Last Step</span>
            </div>
            <div className="topic-modal">
                <div className="topic-modal-header">What are your interests?</div>
                <div className="topic-list row">
                    <div className="topic-tech" onClick={this.clickTech}>
                        <div className="check-conatiner" style={{backgroundColor:this.state.bgColor}}>
                            <div className="check" style={{backgroundimage:this.state.bgImage}}></div>
                        </div>
                    </div>
                    
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

export default ChooseTopics;
