import React, { Component } from 'react';
import Header from '../Navigation/Header';
import { Nav, Tab, Col, Row } from 'react-bootstrap';
import '../../Styles/Home.css';
import feedImg from '../../Images/feed.png';
import bookmarkImg from '../../Images/bookmark.png';
import AskQuestion from "../Question/AskQuestion";
import { connect } from 'react-redux';
import { getAllQuestions } from '../../js/actions/question_actions';
import DisplayQuestion from '../Question/DisplayQuestion';
import { Link } from "react-router-dom";
//for pagination
import ReactPaginate from 'react-paginate';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultImg: false,
            questions: [],
            isDefaultTopic : true,
            followedquestions:[],
             //for pagination
            paginated_questions:[],
            results_per_page: 3,
            num_pages:0
        }
        //for pagination
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    //for pagination
    handlePageClick(data){
    console.log(data.selected)
    let page_number = data.selected;
    let offset = Math.ceil(page_number * this.state.results_per_page)
    this.setState({
        paginated_questions : this.state.questions.slice(offset, offset +this.state.results_per_page)
    })
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
        // for pagination
        const all_questions = questions;
        const pages = Math.ceil(all_questions.length/this.state.results_per_page)
        this.setState({
            num_pages:pages,
            paginated_questions: all_questions.slice(0,this.state.results_per_page),
        });
    }

    closeDiv = (event, index) => {
        console.log(index);
        let questionsArr = this.state.questions;
        console.log(questionsArr[index].question);
        questionsArr.splice(index, 1);
        this.setState({ questions: questionsArr });
        // for pagination
        const all_questions = this.state.questions;
        const pages = Math.ceil(all_questions.length/this.state.results_per_page)
        this.setState({
            num_pages:pages,
            paginated_questions: all_questions.slice(0,this.state.results_per_page),
        });
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

       
        questionsDiv = this.state.paginated_questions.map((record, index) => {
            return (
            <DisplayQuestion question={record} questionIndex={index} isDefaultTopic={this.state.isDefaultTopic} closeCardMethod={this.closeDiv}/>
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
                                                    <Nav.Link eventKey="first">
                                                        <div className="row">
                                                            <img className="left-nav-feed-img" src={feedImg} alt="Feed" />
                                                            <div className="label feed-label">  Feed
                                                              </div>
                                                        </div>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                {topicsNavDiv}
                                                <Nav.Item style={{ marginBottom: "-0.4em" }}>
                                                    <Nav.Link href="/quora/bookmarks" eventKey="second">
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
                                                    <div id="accordion">
                                                        <div className="card profile-card">
                                                            <div className="card-body profile-card-body">
                                                                {this.state.defaultImg &&
                                                                    <div className="row">
                                                                        <div className="profile-logo-home"></div>
                                                                        <div className="home-profie-name">{localStorage.getItem("fullname")}</div>
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
                                            <div className="row">
                            <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={this.state.num_pages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                            />
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
    questions : state.question.payload
});

export default connect(mapStateToProps, { getAllQuestions })(Home);