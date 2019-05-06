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
import axios from 'axios';
import ReactPaginate from 'react-paginate';


class Bookmarks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultImg: false,
            questions: [],
            isDefaultTopic: true,
            followedquestions: [],
            //for pagination
            paginated_questions: [],
            results_per_page: 2,
            num_pages: 0,
            currentPage: 1,
        }
        //for pagination
        this.handlePageClick = this.handlePageClick.bind(this);
    }
    //for pagination
    handlePageClick(data) {
        console.log(data.selected)
        let page_number = data.selected;
        let offset = Math.ceil(page_number * this.state.results_per_page)
        this.setState({
            paginated_questions: this.state.questions.slice(offset, offset + this.state.results_per_page),
            currentPage: page_number
        })
    }

    async componentDidMount() {
        console.log(localStorage.getItem("tagline"))
        //if (localStorage.getItem("image") === null) {
        this.setState({ defaultImg: true });
        //}

        var data = {
            user_id: localStorage.getItem('userid')
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
                        const all_questions = response.data.bookmarks;
                        const pages = Math.ceil(all_questions.length / this.state.results_per_page)
                        this.setState({
                            questions: all_questions,
                            num_pages: pages,
                            paginated_questions: all_questions.slice(0, this.state.results_per_page),
                        });
                    }

            })
    }

    closeDiv = (index) => {
        console.log(index);
        let questionsArr = this.state.questions;
        console.log(questionsArr[((this.state.currentPage-1)*this.state.results_per_page) + index].question);
        questionsArr.splice(index, 1);
       
        let paginatedQuestionsArr = this.state.paginated_questions;
        console.log(paginatedQuestionsArr[index].question);
        paginatedQuestionsArr.splice(index, 1);

        this.setState({ questions: questionsArr, paginated_questions: paginatedQuestionsArr });
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
                <Link className="feed-home-nav" to={topicurl} >
                    <Nav.Item>
                        <div className="label feed-label">{record}</div>
                    </Nav.Item>
                </Link>
            )
        });


        questionsDiv = this.state.paginated_questions.map((record, index) => {
            return (
                <DisplayBookmark question={record} questionIndex={index} isDefaultTopic={this.state.isDefaultTopic} reloadBookmarks={() => { this.closeDiv(index) }} />
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