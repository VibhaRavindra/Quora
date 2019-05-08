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
import axios from 'axios'
import {rooturl} from '../../Config/settings'
import swal from 'sweetalert';
//for pagination
import ReactPaginate from 'react-paginate';

class Topic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            isDefaultTopic: false,
            isTabSelected: false,
            selectedTopic: null,
            topic: null,
            topics:[],
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
        });
    }

    async componentDidMount() {
     console.log(localStorage.getItem("user_name"))
        console.log(localStorage.getItem("topics"),"initial")
        let topic = this.props.match.params.topicName;
        this.setState({"topic": topic.charAt(0).toUpperCase() + topic.slice(1) });
        let img = {technologyImage};
        this.setState({"topicImage": img });

        await this.props.getTopicQuestions(topic);
        let questions = null;
        questions = this.props.questions.questions;
        console.log(this.props.questions.questions);
        this.setState({ questions: questions });
         // for pagination
         const all_questions = questions;
         const pages = Math.ceil(all_questions.length/this.state.results_per_page)
         this.setState({
             num_pages:pages,
             paginated_questions: all_questions.slice(0,this.state.results_per_page),
         });
         //
        let topicsArr=localStorage.getItem("topics");
        topicsArr=topicsArr.split(",");
     
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
        // for pagination
        const all_questions = this.state.questions;
        const pages = Math.ceil(all_questions.length/this.state.results_per_page)
        this.setState({
            num_pages:pages,
            paginated_questions: all_questions.slice(0,this.state.results_per_page),
        });
    }

    updateTopicQuestions = async (event, topic) => {
        console.log("tab clicked");
        //console.log(topic);
        await this.props.getTopicQuestions(topic);
        let questions = null;
        questions = this.props.questions.questions;
        console.log(this.props.questions.questions);
        this.setState({ questions: questions });
        this.setState({ topic: topic});
        this.setState({ selectedTopic: topic});
    }


    unfollowtopic=(e,x)=>{
       swal(x,"topic unfollowed")

       let topicsArr=localStorage.getItem("topics")
       
       console.log("hooorah",topicsArr.replace(x,""),"happy",x);
       let newtopicsArr=[];
      newtopicsArr=topicsArr.split(",");
      var index = newtopicsArr.indexOf(x);
if (index > -1) {
 newtopicsArr.splice(index, 1);
}
      localStorage.setItem("topics", newtopicsArr);
       
      this.setState({topics:newtopicsArr})
       var data={
           user_name:localStorage.getItem("user_name"),
           topicname:x
       }
       axios.post("http://"+rooturl+":3001/quora/unfollowtopic",data, localStorage.getItem('jwtToken'))
    }
    followtopic=(e,x)=>{
        swal(x,"topic followed")

       let topicsArr=localStorage.getItem("topics")
       let newtopicsArr=[];
      newtopicsArr=topicsArr.split(","); 
      newtopicsArr.push(x);
      localStorage.setItem("topics", newtopicsArr);
       console.log(localStorage.getItem("topics"),"hello")
      this.setState({topics:newtopicsArr})
       var data={
           user_name:localStorage.getItem("user_name"),
           topicname:x
       }
       axios.post("http://"+rooturl+":3001/quora/followtopic",data, localStorage.getItem('jwtToken'))
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
                <a className="feed-home-nav" href={topicurl} onClick={(event) => this.updateTopicQuestions(event, record)}>
                    <Nav.Item>
                        <div className="label feed-label">{record}</div>
                    </Nav.Item>
                </a>
            )
        });


        questionsDiv = this.state.paginated_questions.map((record, index) => {
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
                                                <Link className="bookmark-home-nav" to="/quora/bookmarks">
                                                    <Nav.Item>
                                                        <div className="row">
                                                            <img className="left-nav-feed-img" src={feedImg} alt="Feed" />
                                                            <div className="label feed-label">  Bookmark
                                                              </div>
                                                        </div>

                                                    </Nav.Item>
                                                </Link>

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
                                                              
                                                                { localStorage.getItem("topics").split(",").includes(this.state.topic) && this.state.selectedTopic!==null ?
                                                                    
                                                
                                                                    <span class="following-topic-icon follow-topic" onClick={e=>this.unfollowtopic(e,this.state.topic)}>Following</span>
                                                                    :
                                                                    <span class="follow-topic-icon follow-topic" onClick={e=>this.followtopic(e,this.state.topic)}>Follow</span>
                                                               
                                                                }
                                                                
                                                            </div>
                                                        </div>
                                                       
                                                      
                                                    </div>
                                                </div>
                                                {questionsDiv}
                                            </div>
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
    questions: state.question.payload
});

export default connect(mapStateToProps, { getTopicQuestions })(Topic);
