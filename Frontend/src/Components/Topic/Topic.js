import React, { Component } from 'react';
import Header from '../Navigation/Header';
import { Nav, Tab, Col, Row } from 'react-bootstrap';
import '../../Styles/Home.css';
import feedImg from '../../Images/feed.png';
import { connect } from 'react-redux';
import { getTopicQuestions } from '../../js/actions/question_actions';
import DisplayQuestion from '../Question/DisplayQuestion';
import { Link } from "react-router-dom";
import healthImage from '../../Images/topic_health.png';
import technologyImage from '../../Images/topic_technology.png';
import sportsImage from '../../Images/topic_sports.png';
import musicImage from '../../Images/topic_music.png';
import scienceImage from '../../Images/topic_science.png';

class Topic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            isDefaultTopic: false,
            isTabSelected: false,
            selectedTopic: null,
            topic: null
        }
    }

    async componentDidMount() {
        let topicsArr = [];
        topicsArr = ["Technology", "Science"];
        localStorage.setItem("topics", topicsArr);
        localStorage.setItem("name", "Akhila");
        let topic = this.props.match.params.topicName;
        this.setState({"topic": topic.charAt(0).toUpperCase() + topic.slice(1) });
        let img = {technologyImage};
        this.setState({"topicImage": img });

        await this.props.getTopicQuestions(topic);
        let questions = null;
        questions = this.props.questions.questions;
        console.log(this.props.questions.questions);
        this.setState({ questions: questions });

        var lowerCaseTopicsArr = topicsArr.map(function (x) { return x.toLowerCase(); });
        console.log(lowerCaseTopicsArr);
        if (lowerCaseTopicsArr.includes(topic)) {
            console.log("contains topic");
            this.setState({ selectedTopic: topic.charAt(0).toUpperCase() + topic.slice(1) });
        }
    }

    closeDiv = (event, index) => {
        console.log(index);
        let questionsArr = this.state.questions;
        console.log(questionsArr[index].question);
        questionsArr.splice(index, 1);
        this.setState({ questions: questionsArr });
    }

    updateTopicQuestions = async (event, topic) => {
        //console.log("tab clicked");
        //console.log(topic);
        await this.props.getTopicQuestions(topic);
        let questions = null;
        questions = this.props.questions.questions;
        console.log(this.props.questions.questions);
        this.setState({ questions: questions });
        this.setState({ topic: topic});
        this.setState({ selectedTopic: topic});
    }

    render() {

        let topicsNavDiv = null;
        let topics = localStorage.getItem("topics");

        let questionsDiv = null;

        let userTopics = topics.split(",");
        console.log(userTopics);
        topicsNavDiv = userTopics.map((record, index) => {
            let topicurl = "/quora/topic/" + record.toLowerCase();
            return (
                <Link className="feed-home-nav" to={topicurl} onClick={(event) => this.updateTopicQuestions(event, record)}>
                    <Nav.Item>
                        <div className="label feed-label">{record}</div>
                    </Nav.Item>
                </Link>
            )
        });


        questionsDiv = this.state.questions.map((record, index) => {
            return (
                <DisplayQuestion question={record} questionIndex={index} isDefaultTopic={this.state.isDefaultTopic} />
            )
        });

        let tabPanesDiv = null;
        tabPanesDiv = userTopics.map((record, index) => {

            return (
                <Tab.Pane eventKey={record}>
                    <div id="accordion">
                        {questionsDiv}
                    </div>
                </Tab.Pane>

            )
        });
        console.log(this.state.selectedTopic);

        let topicImageDiv = null;

        switch (this.state.topic) {
            case "Technology":
                topicImageDiv = <img src={technologyImage} alt={this.state.topic} height="100px" width="100px"/>;
                break;
            case "Health":
            topicImageDiv = <img src={healthImage} alt={this.state.topic} height="100px" width="100px"/>;
            break;
            case "Sports":
            topicImageDiv = <img src={sportsImage} alt={this.state.topic} height="100px" width="100px"/>;
            break;
            case "Science":
            topicImageDiv = <img src={scienceImage} alt={this.state.topic} height="100px" width="100px"/>;
            break;
            case "Music":
            topicImageDiv = <img src={musicImage} alt={this.state.topic} height="100px" width="100px"/>;
            break;
            default:
                break;
        }

        return (
            

            <div style={{ background: "#fafafa", height: "100vh" }}>
                <Header />
                <div className="row">
                    <div className="container" style={{ marginTop: "5em" }}>
                        <div className="row justify-content-center align-items-center" style={{ height: '10vh' }}>

                            <div className="col-12">
                                <Tab.Container id="left-tabs-example" defaultActiveKey={this.state.selectedTopic} onSelect={this.handleTopicSelect}>
                                    <Row>
                                        <Col sm={2}>

                                            <Nav variant="pills" className="flex-column feed-nav">
                                                <Link className="feed-home-nav" to="/quora/home">
                                                    <Nav.Item>
                                                        <div className="row">
                                                            <img className="left-nav-feed-img" src={feedImg} alt="Feed" />
                                                            <div className="label feed-label">  Feed
                                                              </div>
                                                        </div>

                                                    </Nav.Item>
                                                </Link>
                                                {topicsNavDiv}
                                            </Nav>
                                        </Col>
                                        <Col sm={9}>

                                            <div id="accordion">
                                                <div className="card topic-card" style={{marginBottom:"1em"}}>
                                                    <div className="card-body topic-card-body">
                                                        <div className="row">
                                                            <div className="col-2">
                                                              {topicImageDiv} 

                                                            </div>
                                                            <div className="col-9">
                                                                <h1 className="topic-heading">{this.state.topic}</h1>
                                                                {this.state.selectedTopic === null ?
                                                                    <span class="follow-topic-icon follow-topic">Follow</span>
                                                                    :
                                                                    <span class="following-topic-icon follow-topic">Following</span>
                                                                }
                                                                
                                                            </div>
                                                        </div>
                                                       
                                                      
                                                    </div>
                                                </div>
                                                {questionsDiv}
                                            </div>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    questions: state.question.payload
});

export default connect(mapStateToProps, { getTopicQuestions })(Topic);