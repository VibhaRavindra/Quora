import React, { Component } from 'react';
import MessageList from './MessageList';

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return(
           <div>
           <button className="btn btn-primary float-left" style={{ marginTop: "10px" }} data-toggle="modal" data-target="#messageList">
                                                <i className="fa fa-plus" aria-hidden="true" style={{ marginRight: "5px" }}>
                                                </i>Message</button>
                                            <MessageList />
               </div> 
        )
    }
}

export default Messages;