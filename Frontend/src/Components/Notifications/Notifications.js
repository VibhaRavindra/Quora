import React, { Component } from 'react';
import axios from "axios";

class Notifications extends Component {
  constructor(props){
    super(props);
    this.state={
        number:"",
        rows:[],
        clear:false,
    }
   
    }
    componentDidMount(){
                var data={
                  "user_name":"kavya.chennoju@sjsu.edu"
                }
                axios.defaults.withCredentials = true;
                //make a post request with the user data
                axios.post("http://localhost:3001/quora/notifications",data, localStorage.getItem('jwtToken'))
                        .then(response => {
                        
                  console.log("Status Code : ",response.status);
                  if(response.status === 200){
                      console.log(response.data);
                      this.setState({
                          rows : response.data,
                      })
                      this.props.triggerupdate(JSON.stringify(this.state.rows))
                  }
                
              })
                .catch()
            }
               
          
     


  render() {
    return (<div>
       
    </div>
    );
  }}

export default Notifications;
