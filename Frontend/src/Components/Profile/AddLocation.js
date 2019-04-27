import React, { Component } from 'react';
import '../../Styles/AskQuestion.css';
import axios from 'axios';

class AddLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
        zip:"",
        states:""
        }
    }
    zipchange=(e)=>{
        this.setState({zip:e.target.value})
    }
    statechange=(e)=>{
        this.setState({states:e.target.value})
    }
    addlocation=()=>{
        console.log(this.state.states)
        this.props.triggerlocation(this.state.states)
        var data={
            "user_name":"kavya.chennoju@sjsu.edu",
            "zipcode":this.state.zip,
            "state":this.state.states
          }
          axios.defaults.withCredentials = true;
          //make a post request with the user data
          axios.post("http://localhost:3001/quora/addlocation",data, localStorage.getItem('jwtToken'))
                  .then(
        )
          .catch()
    }
    render() {
        let states=["Alabama - AL",
            "Alaska - AK",
            "Arizona - AZ",
            "Arkansas - AR",
            "California - CA",
            "Colorado - CO",
            "Connecticut - CT",
            "Delaware - DE",
            "Florida - FL",
            "Georgia - GA",
            "Hawaii - HI",
            "Idaho - ID",
            "Illinois - IL",
            "Indiana - IN",
            "Iowa - IA",
            "Kansas - KS",
            "Kentucky - KY",
           "Louisiana - LA",
            "Maine - ME",
            "Maryland - MD",
            "Massachusetts - MA",
            "Michigan - MI",
            "Minnesota - MN",
            "Mississippi - MS",
            "Missouri - MO",
            "Montana - MT",
            "Nebraska - NE",
            "Nevada - NV",
            "NewHampshire - NH",
            "NewJersey - NJ",
            "NewMexico - NM",
            "NewYork - NY",
            "NorthCarolina - NC",
            "NorthDakota - ND",
            "Ohio - OH",
            "Oklahoma - OK",
            "Oregon - OR",
            "Pennsylvania - PA",
            "RhodeIsland - RI",
            "SouthCarolina - SC",
            "SouthDakota - SD",
            "Tennessee - TN",
            "Texas - TX",
            "Utah - UT",
            "Vermont - VT",
            "Virginia - VA",
            "Washington - WA",
            "West - WV",
            "Wisconsin - WI",
            "Wyoming - WY"]
            
        return (
            <div className="modal fade" id="location" tabIndex="-1" role="dialog" aria-labelledby="askQuestionLabel" aria-hidden="true">
                <div className="modal-dialog modal-question" role="document" >
                    <div className="modal-content">
                        <div className="modal-header ask-question-header">
                            <h5 className="modal-title ask-question-title" id="askQuestionLabel">Add Location</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                           
                            <form  method="post">
                                <div className="form-group row">
                                    <div className="col-sm-12">
                                        <input className="form-control" id="questionNew" name="newQuestion" rows="5" placeholder='ZIP CODE' required onChange={this.zipchange}></input>
                                        <select className="form-control" id="questionNew" name="newQuestion" rows="5" placeholder='STATE' required onChange={this.statechange}>
          
             
                   {states.map(member=><option value={member}>{member}</option>)}                    
        
        


                                        </select>
                                       
 
                                    </div>
                                </div>
                                

                            </form>
                                
                        </div>
                        <div className="modal-footer form-group ask-question-footer">
                        <button type="button" className="btn" data-dismiss="modal">Cancel</button>
                                    <button type="submit" className="btn btn-primary add-question-button" onClick={this.addlocation}>Add Location</button>
                                </div>
                    </div>
                </div>
            </div>
        )
    }

}
export default AddLocation;