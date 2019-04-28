import React, { Component } from 'react';
import '../../Styles/Account.css';
import Logo from '../../Images/quora.svg';
import whiteCheck from '../../Images/check-white.svg';
import { selectTopics } from "../../js/actions/action";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

function mapStateToProps(store) {
    return {
        selectTopicsSuccess:store.account.selectTopicsSuccess
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectTopics: (data) => dispatch(selectTopics(data))
    };
}

class ChooseTopics extends Component {
    constructor(props){
        super(props);
        this.state = {
            TechChecked:false,
            ScienceChecked: false,
            MusicChecked: false,
            SportsChecked: false,
            HealthChecked: false
        }
        this.clickTech = this.clickTech.bind(this);
        this.clickScience = this.clickScience.bind(this);
        this.clickMusic = this.clickMusic.bind(this);
        this.clickSports = this.clickSports.bind(this);
        this.clickHealth = this.clickHealth.bind(this);
        this.selectTopics = this.selectTopics.bind(this);
    }
    clickTech =  () => {
        this.setState({
            TechChecked:!this.state.TechChecked
        })
    }
    clickScience = () => {
        this.setState({
            ScienceChecked:!this.state.ScienceChecked
        })
    }
    clickMusic =  () => {
        this.setState({
            MusicChecked:!this.state.MusicChecked
        })
    }
    clickSports = () => {
        this.setState({
            SportsChecked:!this.state.SportsChecked
        })
    }
    clickHealth =  () => {
        this.setState({
            HealthChecked:!this.state.HealthChecked
        })
    }
    selectTopics = () => {
        let selectedTopics = [];
        if(this.state.TechChecked) {
            selectedTopics.push('Technology');
        }
        if(this.state.ScienceChecked) {
            selectedTopics.push('Science');
        }
        if(this.state.MusicChecked) {
            selectedTopics.push('Music');
        }
        if(this.state.SportsChecked) {
            selectedTopics.push('Sports');
        }
        if(this.state.HealthChecked) {
            selectedTopics.push('Health');
        }
        this.props.selectTopics(selectedTopics);
    }
    render() {
        if (localStorage.getItem('isTopicSelected') === "true"){
            console.log("Inside isTopicSelected === true")
            return(<Redirect to="/quora/home"/>)
        }
        let TechBgColor = null, TechBgImage = null, ScienceBgColor = null, ScienceBgImage = null, MusicBgColor = null, MusicBgImage = null, SportsBgColor = null, SportsBgImage = null, HealthBgColor = null, HealthBgImage = null
        if(this.state.TechChecked) {
            TechBgColor = '#329bff'
            TechBgImage = {backgroundImage:`url(${whiteCheck})`}
        }
        if(this.state.ScienceChecked) {
            ScienceBgColor = '#329bff'
            ScienceBgImage = {backgroundImage:`url(${whiteCheck})`}
        }
        if(this.state.MusicChecked) {
            MusicBgColor = '#329bff'
            MusicBgImage = {backgroundImage:`url(${whiteCheck})`}
        }
        if(this.state.SportsChecked) {
            SportsBgColor = '#329bff'
            SportsBgImage = {backgroundImage:`url(${whiteCheck})`}
        }
        if(this.state.HealthChecked) {
            HealthBgColor = '#329bff'
            HealthBgImage = {backgroundImage:`url(${whiteCheck})`}
        }

        let remaining = 2;
        if(this.state.TechChecked) {
            remaining--;
        }
        if(this.state.ScienceChecked) {
            remaining--;
        }
        if(this.state.MusicChecked) {
            remaining--;
        }
        if(this.state.SportsChecked) {
            remaining--;
        }
        if(this.state.HealthChecked) {
            remaining--;
        }
        if(remaining < 0) 
            remaining = 0
        let button = <button className="topic-btn btn-disabled">{remaining} More to continue</button>
        if(remaining <= 0)
            button = <button className="topic-btn" onClick={this.selectTopics}>Continue</button>

    return (
        <div className="topic-container">
            <div className="topic-header">
                <img className="topic-logo" src={Logo} alt="Quora"></img>
                <span className="topic-header-text">One Last Step</span>
            </div>
            <div className="topic-modal">
                <div className="topic-modal-header">What are your interests?</div>
                <div className="topic-list">
                    <div className="topic-tech" onClick={this.clickTech}>
                        <div className="check-conatiner" style={{backgroundColor:TechBgColor}}>
                            <div className="check" style={TechBgImage}></div>
                        </div>
                    </div>
                    <div className="topic-science" onClick={this.clickScience}>
                        <div className="check-conatiner" style={{backgroundColor:ScienceBgColor}}>
                            <div className="check" style={ScienceBgImage}></div>
                        </div>
                    </div>
                    <div className="topic-music" onClick={this.clickMusic}>
                        <div className="check-conatiner" style={{backgroundColor:MusicBgColor}}>
                            <div className="check" style={MusicBgImage}></div>
                        </div>
                    </div>
                    <div className="topic-sports" onClick={this.clickSports}>
                        <div className="check-conatiner" style={{backgroundColor:SportsBgColor}}>
                            <div className="check" style={SportsBgImage}></div>
                        </div>
                    </div>
                    <div className="topic-health" onClick={this.clickHealth}>
                        <div className="check-conatiner" style={{backgroundColor:HealthBgColor}}>
                            <div className="check" style={HealthBgImage}></div>
                        </div>
                    </div>
                </div>
                {button}
            </div>
        </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (ChooseTopics);
