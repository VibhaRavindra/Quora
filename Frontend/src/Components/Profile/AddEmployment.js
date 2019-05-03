import React, { Component } from 'react';
import '../../Styles/AskQuestion.css';
import axios from 'axios'
import {rooturl} from '../../Config/settings'
import swal from 'sweetalert';
class AddEmployment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employment:""
        }
    }
    employmentchange=(e)=>{
        this.setState({employment:e.target.value})
    }
    addemployment=()=>{
        console.log(this.state.employment)
        this.props.triggeremployment(this.state.employment)
        var data={
            "user_name":localStorage.getItem("user_name"),
            "career":this.state.employment
          }
          axios.defaults.withCredentials = true;
          //make a post request with the user data
          axios.post("http://"+rooturl+":3001/quora/addemployment",data, localStorage.getItem('jwtToken'))
                  .then(
        )
          .catch()
    }
    render() {
        return (
            <div className="modal fade" id="employment" tabIndex="-1" role="dialog" aria-labelledby="askQuestionLabel" aria-hidden="true">
                <div className="modal-dialog modal-question" role="document" >
                    <div className="modal-content">
                        <div className="modal-header ask-question-header">
                            <h5 className="modal-title ask-question-title" id="askQuestionLabel">Add Employment</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                           
                            <form method="post">
                                <div className="form-group row">
                                    <div className="col-sm-12">
                                        <textarea className="form-control" id="questionNew" name="newQuestion" rows="5" placeholder='' required onChange={this.employmentchange}></textarea>
                                    </div>
                                </div>
                                

                            </form>
                                
                        </div>
                        <div className="modal-footer form-group ask-question-footer">
                        <button type="button" className="btn" data-dismiss="modal">Cancel</button>
                                    <button type="submit" className="btn btn-primary add-question-button" onClick={this.addemployment}>Add Employment</button>
                                </div>
                    </div>
                </div>
            </div>
        )
    }

}
export default AddEmployment;
