import React, { Component } from 'react';
import Header from '../Navigation/Header';
import { Nav, Tab, Col, Row } from 'react-bootstrap';
import '../../Styles/QuestionAnswers.css';
import axios from 'axios'
import AnswerDetails from "./AnswerDetails"
import AnswerForm from "./AnswerForm"
import CommentForm from "./CommentForm"
import CommentList from "./CommentList"

class SingleQuestionAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultImg: false,
            question: {},
            openAnswer: '',
            commentOpen: false
        };

        this.comments = this.comments.bind(this)
        this.CreateAnswer = this.CreateAnswer.bind(this);
        this.closeFormAndReload = this.closeFormAndReload.bind(this);
    }

    closeFormAndReload = () => {
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
        axios.get('/content/getanswer/' + this.props.match.params.questionId + "/"+
        this.props.match.params.answerId)
            .then((response) => {
                if (response !== undefined)
                    if (response.status === 200) {
                        console.log(response);
                        this.setState({ question: response.data.question, openAnswer: '' });
                    }
            })
    }

    componentWillMount() {
        let topicsArr = [];
        topicsArr = ["Technology", "Science"];

        if (localStorage.getItem("image") === null) {
            this.setState({ defaultImg: true });
        }
        console.log("CALL")
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
        axios.get('/content/getanswer/' + this.props.match.params.questionId + "/"+
        this.props.match.params.answerId)
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
            openAnswer: <AnswerForm question_id={questionId} closeAnswerFormAndReload={this.closeFormAndReload} />
        })
    };

    comments(answer) {
        var comments = answer.comments;
        if (comments.length === 0) {
            return (<div className="qa-comments">
                <CommentForm answer={answer}  closeCommentFormAndReload={this.closeFormAndReload} />
            </div>);
        } else {
            if (this.state.commentOpen) {
                return (<div className="qa-comments">
                    <CommentForm  answer={answer}  closeCommentFormAndReload={this.closeFormAndReload}/>
                    <CommentList comments={comments} />
                </div>);
            } else {
                return (<div className="qa-comments">
                <CommentForm  answer={answer}  closeCommentFormAndReload={this.closeFormAndReload}/>

                    <CommentList comments={comments} minimal="true" />
                </div>);
            }
        }
    }

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
                let answersList = record.answers;
                answersList.sort((a, b) => (b.upvote_count - a.upvote_count !== 0) ? (b.upvote_count - a.upvote_count) : (a.downvote_count - b.downvote_count))

                ansdiv = answersList.map((answer, index) => {
                    console.log("Debug answer div")
                    console.log("Debug upvote count: " + answer.upvote_count)
                    console.log(JSON.stringify(answer))
                    console.log(answer)

                    return (
                        <div>
                            <AnswerDetails answer={answer} />
                            {this.comments(answer)}
                        </div>
                    )

                });
            } else {
                console.log("Debug no answers")
                return null;
            }

            let questionFooterDiv = null;
            questionFooterDiv = (
                <div>
                    <div>
                        <div className="row" style={{ marginTop: "0.3em" }}>
                            <div className="question-footer-elem" style={{ marginLeft: "0.3em" }}>
                                <div className="answer-icon answer-icon-label" onClick={() => { this.CreateAnswer(this.props.match.params.questionId) }}>Answer</div>
                            </div>
                            <div className="question-footer-elem" >
                                <div className="follow-icon answer-icon-label">Follow</div>
                            </div>
                            <div className="question-footer-elem-share-icons" style={{ marginLeft: "20em" }}>
                                <div className="fb-icon answer-icon-hide">&nbsp;</div>
                            </div>
                            <div className="question-footer-elem-share-icons">
                                <div className="twitter-icon answer-icon-hide">&nbsp;</div>
                            </div>
                            <div className="question-footer-elem-share-icons">
                                <div className="share-icon answer-icon-hide">&nbsp;</div>
                            </div>
                            <div className="question-footer-elem-share-icons">
                                <div className="dots-icon answer-icon-hide">&nbsp;</div>
                            </div>

                        </div>
                    </div>
                </div>
            );

            return (
                <div className="card question-answer-card">
                    <div className="card-body question-answer-card-body">
                        <span className="card-title question-answer-card">{record.question}</span>
                        
                        {this.state.openAnswer}
                        
                        {ansdiv}
                    </div>
                </div>
            )
        });

        return (
            <div className="question-answers">
                {redirectVar}
                <Header />
                <div className="row">
                    <div className="container" style={{ marginTop: "5em" }}>
                        <div className="row justify-content-center align-items-center">

                            <div className="col-12">
                                <Tab.Container id="left-tabs-example" defaultActiveKey="first" onSelect={this.handleSelect}>
                                    <Row>
                                        <Col sm={1} />
                                        <Col sm={8}>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="first">
                                                    <div id="accordion">
                                                        {questionDiv()}
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

export default SingleQuestionAnswer;