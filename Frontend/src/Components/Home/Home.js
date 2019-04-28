import React, { Component } from 'react';
import Header from '../Navigation/Header';
import { Nav, Tab, Col, Row } from 'react-bootstrap';
import '../../Styles/Home.css';
import feedImg from '../../Images/feed.png';
import AskQuestion from "../Question/AskQuestion";
import { connect } from 'react-redux';
import { getAllQuestions } from '../../js/actions/question_actions';
import DisplayQuestion from '../Question/DisplayQuestion';
import { Link } from "react-router-dom";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultImg: false,
            questions: [],
            isDefaultTopic : true,
            followedquestions:[]
        }
    }

    async componentDidMount() {
        console.log(localStorage.getItem("tagline"))
        //if (localStorage.getItem("image") === null) {
            this.setState({ defaultImg: true });
        //}
        await this.props.getAllQuestions();
        let questions = null;
        questions = this.props.questions.questions;
        console.log(this.props.questions.questions);
        this.setState({ questions: questions});
        

    }

    closeDiv = (event, index) => {
        console.log(index);
        let questionsArr = this.state.questions;
        console.log(questionsArr[index].question);
        questionsArr.splice(index, 1);
        this.setState({ questions: questionsArr });
    }

    render() {

        let topicsNavDiv = null;
        let topics = localStorage.getItem("topics");

        let questionsDiv = null;

        let userTopics = topics.split(",");
        console.log(userTopics);
        topicsNavDiv = userTopics.map((record, index) => {
            let topicurl = "/quora/topic/"+record.toLowerCase();
            return (
                <Link className="feed-home-nav" to={topicurl} >
                <Nav.Item>
                        <div className="label feed-label">{record}</div>
                </Nav.Item>
                </Link>
            )
        });

       
        questionsDiv = this.state.questions.map((record, index) => {
            return (
            <DisplayQuestion question={record} questionIndex={index} isDefaultTopic={this.state.isDefaultTopic} closeCardMethod={this.closeDiv}/>
            )
        });

        return (
            <div style={{ background: "#fafafa", height: "100vh" }}>
                <Header />
                <div className="row">
                    <div className="container" style={{ marginTop: "5em" }}>
                        <div className="row justify-content-center align-items-center" style={{ height: '10vh' }}>

                            <div className="col-12">
                                <Tab.Container id="left-tabs-example" defaultActiveKey="first" onSelect={this.handleTopicSelect}>
                                    <Row>
                                        <Col sm={2}>
                                            <Nav variant="pills" className="flex-column feed-nav">
                                                <Nav.Item style={{ marginBottom: "-0.4em" }}>
                                                    <Nav.Link eventKey="first">
                                                        <div className="row">
                                                            <img className="left-nav-feed-img" src={feedImg} alt="Feed" />
                                                            <div className="label feed-label">  Feed
                                                              </div>
                                                        </div>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                {topicsNavDiv}
                                            </Nav>
                                        </Col>
                                        <Col sm={9}>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="first">
                                                    <div id="accordion">
                                                        <div className="card profile-card">
                                                            <div className="card-body profile-card-body">
                                                                {this.state.defaultImg &&
                                                                    <div className="row">
                                                                        <div className="profile-logo-home"></div>
                                                                        <div className="home-profie-name">{localStorage.getItem("name")}</div>
                                                                    </div>
                                                                }
                                                                <button className="btn" data-toggle="modal" data-target="#askQuestion">

                                                                    <span className="card-title profile-question-card">What is your question or link?</span>
                                                                </button>
                                                                <AskQuestion/>
                                                            </div>
                                                        </div>
                                                        {questionsDiv}
                                                    </div>
                                                </Tab.Pane>
                                            </Tab.Content>
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
    questions : state.question.payload
});

export default connect(mapStateToProps, { getAllQuestions })(Home);