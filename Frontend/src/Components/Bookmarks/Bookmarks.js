import React, { Component } from 'react';
import Header from '../Navigation/Header';
import { Nav, Tab, Col, Row } from 'react-bootstrap';
import '../../Styles/Home.css';
import feedImg from '../../Images/feed.png';
import bookmarkImg from '../../Images/bookmark.png';
import AskQuestion from "../Question/AskQuestion";
import { connect } from 'react-redux';
import { getAllQuestions } from '../../js/actions/question_actions';
import DisplayBookmark from './DisplayBookmark';
import { Link } from "react-router-dom";
import axios from 'axios'


class Bookmarks extends Component {
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

        var data = {
            user_id : localStorage.getItem('userid')
        }
        console.log(data)
       axios.defaults.withCredentials = true;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
        axios.post('/bookmarks', data)
            .then((response) => {
                console.log(response)
                if (response !== undefined)
                    if (response.status === 200) {
                        console.log(response);
                        this.setState({ questions: response.data.bookmarks });
                    }
            })
    }

    closeDiv = (index) => {
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
            <DisplayBookmark question={record} questionIndex={index} isDefaultTopic={this.state.isDefaultTopic} reloadBookmarks={() => {this.closeDiv(index)}}/>
            )
        });

        return (
            <div className="home-container">
                <Header />
                <div className="row">
                    <div className="container" style={{ marginTop: "5em" }}>
                        <div className="row justify-content-center align-items-center">

                            <div className="col-12">
                                <Tab.Container id="left-tabs-example" defaultActiveKey="first" onSelect={this.handleTopicSelect}>
                                    <Row>
                                        <Col sm={2}>
                                            <Nav variant="pills" className="flex-column feed-nav">
                                                <Nav.Item style={{ marginBottom: "-0.4em" }}>
                                                    <Nav.Link href="/quora/home" eventKey="second">
                                                        <div className="row">
                                                            <img className="left-nav-feed-img" src={feedImg} alt="Feed" />
                                                            <div className="label feed-label">  Feed
                                                              </div>
                                                        </div>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                {topicsNavDiv}
                                                <Nav.Item style={{ marginBottom: "-0.4em" }}>
                                                    <Nav.Link href="/quora/bookmarks" eventKey="first">
                                                        <div className="row">
                                                            <img className="left-nav-feed-img" src={bookmarkImg} alt="Feed" />
                                                            <div className="label bookmark-label">  Bookmarks
                                                              </div>
                                                        </div>
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </Col>
                                        <Col sm={9}>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="first">
                                                        {questionsDiv}
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

export default Bookmarks;