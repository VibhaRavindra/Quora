import React, { Component } from 'react';
import '../../Styles/AskQuestion.css';
import '../../Styles/Messages.css';
import ComposeMessage from './ComposeMessage';
import { connect } from 'react-redux';
import { getMessageConversationList, getMessages } from '../../js/actions/message_actions';

class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList : [],
            messages: [],
            title: "Messages"
        }
    }
    async componentWillMount(){
        let user = localStorage.getItem("user_name")
        await this.props.getMessageConversationList(user);
        console.log("-------------------------");
        console.log(this.props.messageList);
        this.setState({messageList: this.props.messageList.messageList});
        this.setState({messages: []});
    }

    handleClick = async (event, fromID, toID, name) => {
        this.setState({"title": "Conversation with "+name});
        console.log(fromID+toID);
        await this.props.getMessages(fromID, toID);
        console.log(this.props.messages.messages);
        this.setState({messageList:[]});
        this.setState({messages: this.props.messages.messages });

    }

    handleClose = async() => {
        let user = localStorage.getItem("user_name")
        await this.props.getMessageConversationList(user);
        console.log("-------------------------");
        console.log(this.props.messageList);
        this.setState({messageList: this.props.messageList.messageList});
        this.setState({messages: []});
        this.setState({title: "Messages"});
    }



    render() {

      let messageListDiv = null;
      messageListDiv = this.state.messageList.map((record, index) => {
        let currentUser = localStorage.getItem("user_name");
        let otherUser_name = null;
        let messagePreText = null;
        if(currentUser === record.latest_message.from_user_name){
            otherUser_name = record.latest_message.to_name;
            messagePreText = "You Sent:";
        }
        else{
            otherUser_name = record.latest_message.from_name;
            messagePreText = "You Recieved:";
        }
        let timestamp = new Date(record.latest_message.timestamp);
                     let date = timestamp.getDate();
                     let month = timestamp.getMonth(); 
                     var monthsText = {'1':'Jan', '2':'Feb', '3':'Mar', '4': 'Apr'};
        return (
          <li class="list-group-item message-record-list" onClick={(event)=>this.handleClick(event,record.latest_message.from_user_name, record.latest_message.to_user_name, otherUser_name)}>
              <div className="row">
                <span className="message-person-name">{otherUser_name}</span>
              </div>
                <span className="message-latest-text">{messagePreText}&nbsp;{record.latest_message.message}</span>
              <small className="float-right">{date}&nbsp;{monthsText[month]}</small>
          </li>
        )
        });


        let messageSingleConversationDiv = null;
        messageSingleConversationDiv = this.state.messages.map((record, index) => {
        let currentUser = localStorage.getItem("user_name");
        let timestamp = new Date(record.timestamp);
                     let date = timestamp.getDate();
                     let month = timestamp.getMonth(); 
                     let hours = timestamp.getHours();
                     let mins = timestamp.getMinutes();
                     var monthsText = {'1':'Jan', '2':'Feb', '3':'Mar', '4': 'Apr'};

        let messageDiv = null;
        if(currentUser === record.from_user_name){
            console.log("from message");
            messageDiv = <li class="list-group-item" style={{border:"none"}}>
            <div className="row float-right">
              <span className="message-css" >
                  {record.message}</span>
            </div>
            <div className="row" style={{marginLeft: "24em"}}>
            <span className="float-right timestamp">{hours}:{mins}&nbsp;{date}&nbsp;{monthsText[month]}</span>
            </div>
        </li>;
        }
        else{
            messageDiv = <li class="list-group-item" style={{border:"none"}} >
            <div className="row">
              <span  className="message-css-blue">{record.message}</span>
            </div>
            <div className="row">
            <small className="timestamp-blue">{hours}:{mins}&nbsp;{date}&nbsp;{monthsText[month]}</small>
            </div>
        </li>;
        }
        return (
            <div>
            {messageDiv}
            </div>
        )
        });

        

        return (
            <div className="modal fade" id="messageList" tabIndex="-1" role="dialog" aria-labelledby="askQuestionLabel" aria-hidden="true">
                <div className="modal-dialog modal-question" role="document" >
                    <div className="modal-content">
                        <div className="modal-header ask-question-header">
                            <span className="message-title">{this.state.title}</span>
                            <button type="button" className="close" ref={input => this.inputElement = input} data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                        <ul class="list-group">
                            {messageListDiv}
                            </ul> 
                        <ul class="list-group" >
                                {messageSingleConversationDiv}
                        </ul>
                        </div>
                        <div className="modal-footer form-group ask-question-footer">
                        <button type="button" className="btn" onClick={this.handleClose}>Cancel</button>
                                    <button type="button" className="btn btn-primary add-question-button" data-toggle="modal" data-target="#composeMessage">New Message</button>
                               <ComposeMessage/>
                                </div>
                    
                </div>
            </div>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    messageList : state.message.conversationList,
    messages : state.message.messageList
});


export default connect(mapStateToProps, { getMessageConversationList, getMessages })(MessageList);