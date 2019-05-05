import React, { Component } from 'react';
import '../../Styles/AskQuestion.css';
import '../../Styles/Messages.css';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import { getEmailList, saveMessage } from '../../js/actions/message_actions';
import swal from 'sweetalert';
import '../../Styles/Messages.css';

class ComposeMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: [],
            emailList: [{}],
            msg: ""
        }
    }

    async componentDidMount(){  
        await this.props.getEmailList();
       // this.setState({ emailList : this.props.emailListStore.emailList});
        console.log("-------------------------");
        console.log(this.props.emailList.emailList);
        this.setState({"emailList": this.props.emailList.emailList });

    }

    getSuggestionValue = suggestion => suggestion.user_name;

    renderSuggestion = suggestion => (
        <div>
            {suggestion.user_name}
        </div>
    );

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };


    getSuggestions = value => {
        let inputValue = null;
         inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.state.emailList.filter(listItem =>
            listItem.user_name.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    onSuggestionsFetchRequested = ({ value }) => {  

        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    handleMessageChange = (e) => {
        this.setState({msg: e.target.value});
     }

    saveMessage = async () => {
        let to = this.state.value;
        let from = localStorage.getItem("user_name");
        let  msg = this.state.msg;
        let isValidEmail = false;
        console.log(msg);
        for(let i=0;i<this.state.emailList.length;i++){
            if(this.state.emailList[i].user_name === to){
                isValidEmail = true;
                break;
            }
        }
        console.log(isValidEmail);
        if(to === from || !isValidEmail){
            swal("Invalid to address. Please enter a valid to email");
        }
        else{
            let data = { "to": to, 
                        "from": from, 
                        "message": msg,
                        "sent_from_name": localStorage.getItem("fullname")
                        };
            await this.props.saveMessage(data);
    }
    //this.inputElement.click();   
    window.location.reload();
    }

    handleCancel = async (event) => {
       this.setState({value:""});
       this.setState({msg:""});
    }

    render() {
        const { value } = this.state;
        const inputProps = {
            value,
            onChange: this.onChange,
            className: "form-control",
            required:"required",
            name:"to",
            
        };
        return (
            <div className="modal fade" id="composeMessage" tabIndex="-1" role="dialog" aria-labelledby="askQuestionLabel" aria-hidden="true">
                <div className="modal-dialog modal-question" role="document" >
                    <div className="modal-content">
                        <div className="modal-header ask-question-header">
                            <span className="message-title">New Message</span>
                            <button type="button" className="close" ref={input => this.inputElement = input} data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-body">
                                <form >
                                    <div className="form-group row">
                                        <label htmlFor="from" className="col-sm-2 col-form-label">From:</label>
                                        <div className="col-sm-7">
                                            <input type="email" className="form-control" name="from" value={localStorage.getItem("user_name")} readOnly required />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="to" className="col-sm-2 col-form-label">To:</label>
                                        <div className="col-sm-7">
                                         <Autosuggest
                                                suggestions={this.state.suggestions}
                                                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                                getSuggestionValue={this.getSuggestionValue}
                                                renderSuggestion={this.renderSuggestion}
                                                inputProps={inputProps}
                                                ref="to"
                                            /> 
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="mesg" ref="message" className="col-sm-2 col-form-label">Message:</label>
                                        <div className="col-sm-7">
                                            <textarea className="form-control" id="msg" name="msg" rows="3"  onChange={this.handleMessageChange} value={this.state.msg}required></textarea>
                                        </div>
                                    </div>
                                    
                                </form>
                            </div>
                            
                        </div>
                        <div className="modal-footer form-group ask-question-footer">
                                        <button type="button" className="btn" onClick={this.handleCancel}>Cancel</button>
                                        <button type="button"  className="btn btn-primary add-question-button" onClick={this.saveMessage}>Send</button>
                                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    emailList : state.message.emailList
});


export default connect(mapStateToProps, { getEmailList, saveMessage })(ComposeMessage);