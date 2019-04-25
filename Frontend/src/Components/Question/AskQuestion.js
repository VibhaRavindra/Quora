import React, { Component } from 'react';
import '../../Styles/AskQuestion.css';

class AskQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="modal fade" id="askQuestion" tabIndex="-1" role="dialog" aria-labelledby="askQuestionLabel" aria-hidden="true">
                <div className="modal-dialog modal-question" role="document" >
                    <div className="modal-content">
                        <div className="modal-header ask-question-header">
                            <h5 className="modal-title ask-question-title" id="askQuestionLabel">Add Question</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
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
                            <form onSubmit={this.addQuestion} method="post">
                                <div className="form-group row">
                                    <div className="col-sm-12">
                                        <textarea className="form-control" id="questionNew" name="newQuestion" rows="5" placeholder='Start typing your question with "What", "How", "Why", etc.' required></textarea>
                                    </div>
                                </div>
                                

                            </form>
                                
                        </div>
                        <div className="modal-footer form-group ask-question-footer">
                        <button type="button" className="btn" data-dismiss="modal">Cancel</button>
                                    <button type="submit" className="btn btn-primary add-question-button">Add Question</button>
                                </div>
                    </div>
                </div>
            </div>
        )
    }

}
export default AskQuestion;