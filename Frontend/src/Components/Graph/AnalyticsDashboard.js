import React, { Component } from 'react';
import Header from '../Navigation/Header';
import { Nav, Tab, Col, Row } from 'react-bootstrap';
import '../../Styles/SeeAllNotifications.css';
import Answersviewsgraph from './answerviewsgraph'
import Downvotegraph from './downvotegraph'
import Upvotegraph from './upvotegraph'

class AnalyticsDashboard extends Component {
    constructor(props) {
        super(props);
     
    }


    render() {
    
        return (
            <div style={{ background: "#fafafa", height: "100vh" }}>
          <Answersviewsgraph />
          <br />
              <Downvotegraph />
              <br />
              <Upvotegraph />
              <br />
            </div>
        )
    }
}

export default AnalyticsDashboard;
