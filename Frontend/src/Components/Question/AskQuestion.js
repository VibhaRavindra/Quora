import React, { Component } from 'react';
import '../../Styles/AskQuestion.css';

import { connect } from 'react-redux';
import { addQuestion } from '../../js/actions/question_actions';


class AskQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionText: null,
            selectValue : "technology"
        }
    }

    componentWillMount(){
        //need to be removed after integration
      
    }

    handleQuestionTextChange = (e) => {
        this.setState({questionText: e.target.value});
     }

     handleSelectChange = (e) => {
        this.setState({selectValue: e.target.value});
     }

    addQuestion = async (event) => {
        event.preventDefault();
        let data = { "question": this.state.questionText, 
                     "topic_name": this.state.selectValue, 
                     "owner_id": localStorage.getItem("userid"),
                     "owner_name": localStorage.getItem("fullname"),
                     "owner_username":localStorage.getItem("user_name")
                    };
        await this.props.addQuestion(data);
        this.setState({questionText:"", selectValue:"technology"});
        this.inputElement.click();
        //window.location.reload();
        this.props.refreshQuestions();
    }

    render() {
        return (
            <div className="modal fade" id="askQuestion" tabIndex="-1" role="dialog" aria-labelledby="askQuestionLabel" aria-hidden="true">
                <div className="modal-dialog modal-question" role="document" >
                    <div className="modal-content">
                        <div className="modal-header ask-question-header">
                            <h5 className="modal-title ask-question-title" id="askQuestionLabel">Add Question</h5>
                            <button type="button" className="close" ref={input => this.inputElement = input} data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="border-bottom" style={{marginBottom:"1em"}}>
                                <p class="tips-heading">Tips on getting good answers quickly</p>
                                <ul style={{paddingLeft:"0px"}}>
                                    <div className="tip-icon tips"> Make sure your question hasn't been asked already </div>  
                                    <div className="tip-icon tips"> Keep your question short and to the point </div> 
                                    <div className="tip-icon tips"> Double-check grammar and spelling </div>   
                                </ul>
                            </div>
                            <form >
                                <div className="form-group row">
                                    <div className="col-sm-12">
                                        <textarea className="form-control" ref="question" onChange={this.handleQuestionTextChange} id="questionNew" name="newQuestion" 
                                        value={this.state.questionText} rows="5" placeholder='Start typing your question with "What", "How", "Why", etc.' required></textarea>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                        <div className="row">
                                        <label htmlFor="courseID" style={{paddingTop: "6px"}}>Choose topic for the Question:&nbsp;&nbsp;</label>
                                                    <select className="form-control" name="operation" style={{padding:"0em",width:"50%"}} onChange={this.handleSelectChange} value={this.state.selectValue}>
                                                        <option value="technology">Technology</option>
                                                        <option value="health">Health</option>
                                                        <option value="science">Science</option>
                                                        <option value="music">Music</option>
                                                        <option value="sports">Sports</option>
                                                    </select>
                                                    </div>
                                </div>
                                

                            </form>
                                
                        </div>
                        <div className="modal-footer form-group ask-question-footer">
                        <button type="button" className="btn" data-dismiss="modal">Cancel</button>
                                    <button type="submit" className="btn btn-primary add-question-button" onClick={this.addQuestion}>Add Question</button>
                                </div>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => ({
    responseMessage : state.question.payload
});

export default connect(mapStateToProps, { addQuestion})(AskQuestion);