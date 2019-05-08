import React, { Component } from 'react';
import '../../Styles/SeeAllNotifications.css';
import { Bar } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { getProfileViews } from '../../js/actions/graph_actions';


class profilegraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultImg: false,
            days:[],
            profileViews: []
        }
    }
    componentDidMount = async () => {
        var today = new Date();
        var month = today.getMonth() + 1; //January is 0!
        var year = today.getFullYear();
        let user_id = localStorage.getItem("user_name");
        let data ={};
        data = {"user_id":user_id,"month":month,"year":year};
        await this.props.getProfileViews(data);
        let results = this.props.results.results;
        this.setState({results: results });
        let days=[],views=[];
        this.state.results.map(member=> days.push(member.day));
        this.state.results.map(member=> views.push(member.views));
                    console.log(days);
                    console.log(views);
        this.setState({days:days,profileViews:views});
    }

    render() {
        const data = {
            labels: this.state.days,
            datasets: [
              {
                label: 'Profile Views Per Day of this Month',
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
                data: this.state.profileViews
              }
            ]
          }
console.log(this.state.profileViews)
        return (
            <div style={{ background: "#fafafa"}}>
                   <Bar ref="chart" data={data} />
            </div>
        )
    }
}


const mapStateToProps = state => ({
    results : state.graph.views
});

export default connect(mapStateToProps, { getProfileViews })(profilegraph);
