import React, { Component } from 'react';
import Header from '../Navigation/Header';
import { Nav, Tab, Col, Row } from 'react-bootstrap';
import '../../Styles/QuestionAnswers.css';
import feedImg from '../../Images/feed.png';
import axios from 'axios'
import AnswerDetails from "./AnswerDetails"
import AnswerForm from "./AnswerForm"

class QuestionAnswers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultImg: false,
            question: {},
            openAnswer: ''
        }
        this.CreateAnswer = this.CreateAnswer.bind(this);
        this.closeAnswerFormAndReload = this.closeAnswerFormAndReload.bind(this);
    }

    closeAnswerFormAndReload = () => {
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
        axios.get('/answer/' + this.props.match.params.questionId)
        .then((response) => {
          if (response !== undefined)
            if (response.status === 200) {
              console.log(response);
              this.setState({ question: response.data.question, openAnswer : '' });
            }
        })
    }

    componentWillMount() {
        let topicsArr = [];
        topicsArr = ["Technology", "Science"];
        localStorage.setItem("topics", topicsArr);
        localStorage.setItem("name", "Akhila");
        if (localStorage.getItem("image") === null) {
            this.setState({ defaultImg: true });
        }
        console.log("CALL")
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
        axios.get('/answer/' + this.props.match.params.questionId)
        .then((response) => {
          if (response !== undefined)
            if (response.status === 200) {
              console.log(response);
              this.setState({ question: response.data.question });
            }
        })
    }

    CreateAnswer = (questionId) => {
        console.log(questionId);
        this.setState({
            openAnswer: <AnswerForm question_id = {questionId}  closeAnswerFormAndReload = {this.closeAnswerFormAndReload} />
        })
    }; 

    render() {
        let redirectVar = '';
        //need to enable after login
        /*if (!localStorage.getItem('cookie1')) {
            redirectVar = <Redirect to="/login" />
        }*/

        let questionDiv = null;
        let topicsDiv = null;
        let topics = localStorage.getItem("topics");

        let userTopics = topics.split(",");
        console.log(userTopics);
        topicsDiv = userTopics.map((record, index) => {

            return (
                <Nav.Item>
                    <Nav.Link eventKey={record} className="left-tabs-feed">
                        <div className="label feed-label">{record}</div>
                    </Nav.Link>
                </Nav.Item>

            )
        });


        questionDiv = (() => {
            let record = this.state.question
            console.log("Debug question div")
            let ansdiv = null;
            
            if (record.answers) {
                console.log("Debug record.answers")
                let answersList =record.answers;
                answersList.sort((a, b) => (b.upvote_count - a.upvote_count !== 0) ? (b.upvote_count - a.upvote_count) : (a.downvote_count - b.downvote_count))
                
                ansdiv = answersList.map((answer, index) => {
                    console.log("Debug answer div")
                    console.log("Debug upvote count: " + answer.upvote_count)
                    console.log(JSON.stringify(answer))
                    
                   return( <AnswerDetails answer={answer}/> )
               
                });
            } else {
                console.log("Debug no answers")
                return null;
            }

            let questionFooterDiv = null;
            questionFooterDiv = (
            <div>
            <div>
            <div className="row" style={{marginTop:"0.3em"}}>
                <div className="question-footer-elem" style={{marginLeft:"0.3em"}}>
                <div className="answer-icon answer-icon-label" onClick = {() => {this.CreateAnswer(this.props.match.params.questionId)}}>Answer</div>
                </div>
                <div className="question-footer-elem" >
                <div className="follow-icon answer-icon-label">Follow</div>
                </div>
                <div className="question-footer-elem-share-icons" style={{marginLeft:"20em"}}>
                <div className="fb-icon answer-icon-hide">a</div>
                </div>
                <div className="question-footer-elem-share-icons">
                <div className="twitter-icon answer-icon-hide">a</div>
                </div>
                <div className="question-footer-elem-share-icons">
                <div className="share-icon answer-icon-hide">a</div>
                </div>
                <div className="question-footer-elem-share-icons">
                <div className="dots-icon answer-icon-hide">a</div>
                </div>

            </div>
            </div>
            </div>
            );

            return (
                <div className="card question-answer-card">
                    <div className="card-body question-answer-card-body">
                            <span className="card-title question-answer-card">{record.question}</span>
                            {questionFooterDiv}
                            {this.state.openAnswer}
                            <h5> {record.answers.length} Answers </h5>
                            {ansdiv}
                    </div>
                </div>
            )
        });

        return (
            <div className="question-answers" style={{ background: "#fafafa", height: "100vh" }}>
                {redirectVar}
                <Header />
                <div className="row">
                    <div className="container" style={{ marginTop: "5em" }}>
                        <div className="row justify-content-center align-items-center" style={{ height: '10vh' }}>

                            <div className="col-12">
                                <Tab.Container id="left-tabs-example" defaultActiveKey="first" onSelect={this.handleSelect}>
                                    <Row>
                                    <Col sm={1} />
                                        <Col sm={9}>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="first">
                                                    <div id="accordion">
                                                        {questionDiv()  }
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="second">
                                                    <div id="accordion">
                                                        {"Second tab selected"}
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

export default QuestionAnswers;