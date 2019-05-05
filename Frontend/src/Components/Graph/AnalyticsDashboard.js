import React, { Component } from 'react';
import '../../Styles/SeeAllNotifications.css';
import Answersviewsgraph from './answerviewsgraph'
import Downvotegraph from './downvotegraph'
import Upvotegraph from './upvotegraph'
import Profilegraph from './profilegraph';
import Bookmarksgraph from './bookmarksgraph';

class AnalyticsDashboard extends Component {
    constructor(props) {
        super(props);

    }


    render() {

        return (
            <div>
            <h1 style={{fontWeight: "700", margin: "0.5em"}}>User Dashboard</h1>
            <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                
                <div className="container">
                    <div className="row mt-4">
                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <Answersviewsgraph />
                            </div>
                        </div>

                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <Downvotegraph />
                            </div>
                        </div>

                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <Upvotegraph />
                            </div>
                        </div>

                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <Profilegraph />
                            </div>
                        </div>

                        <div className="card card-custom mx-4 mb-5" style={{ boxShadow: "2px 2px 2px #888888", "height": "18em", "width": "30em" }}>

                            <div className="card-body" >
                                <Bookmarksgraph />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default AnalyticsDashboard;
