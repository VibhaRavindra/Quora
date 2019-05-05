import React, { Component } from 'react';
import Header from '../Navigation/Header';
import { Nav, Tab, Col, Row } from 'react-bootstrap';
import '../../Styles/SeeAllNotifications.css';
import feedImg from '../../Images/feed.png';
import { Link } from "react-router-dom";
import axios from 'axios';
import {rooturl} from '../../Config/settings'
import { Bar } from 'react-chartjs-2';


class downvotegraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultImg: false,
            rows: [{}],
            answers:[],
            downvotes:[]
        }
    }
    componentDidMount(){
        var data={
            owner_username:localStorage.getItem("user_name")
        }
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post("http://"+rooturl+":3001/quora/graphdownvote",data)
                .then(response => {
                
          console.log("Status Code : ",response.status);
          if(response.status === 200){
              console.log(response.data);
              this.setState({
                  rows : response.data,
              })
              console.log(this.state.rows)
              var answers=[],downvotes=[]
              this.state.rows.map(member=>
        answers.push(member._id)
                )
                this.state.rows.map(member=>
                    downvotes.push(member.downvote_count)
                            )
                console.log(downvotes)
                this.setState({answers:answers,downvotes:downvotes})
          }
      })
        .catch()
    }

    render() {
        const data = {
            labels: this.state.answers,
            datasets: [
              {
                label: 'TOP TEN DOWNVOTED ANSWERS',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.state.downvotes
              }
            ]
          }
console.log(this.state.downvotes)
        return (
            <div style={{ background: "#fafafa" }}>
                   <Bar ref="chart" data={data} />
            </div>
        )
    }
}

export default downvotegraph;
