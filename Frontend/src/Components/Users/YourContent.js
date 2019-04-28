import React from 'react'
import axios from 'axios'
import {getquestionsasked,getquestionsfollowed,getuseranswers} from '../../js/actions/yourcontent'
import Header from '../Navigation/Header'
import "../../Styles/YourContent.css"
import { connect } from 'react-redux';
import propTypes from 'prop-types'
class YourContent extends React.Component{
    constructor(){
        super();
 this.state ={
     getquestionsasked:'',
     getquestionsfollowed:'',
     getuseranswers:'',
     questionsasked1:[
                 "what is the value of pi?",
                     ],
     questionsfollowed1:[
                 "what if earth has no oceans?"  
                     ],
      searchString: '',
      users: [],
      isDefaultTopic : true,
 }
 this.getquestionsasked=this.getquestionsasked.bind(this);
 
 this.getquestionsfollowed=this.getquestionsfollowed.bind(this);
 
 this.getuseranswers=this.getuseranswers.bind(this);
 this.handleChange = this.handleChange.bind(this);
}    
 
           getquestionsasked = async() => {
               this.setState({isDefaultTopic : false});
               let userid = localStorage.getItem("userid");
               console.log(userid);
               await this.props.getquestionsasked(userid);
             console.log(this.props.questionsasked);
            //  let questions = null;
            //  questions=this.props.questions;
            //  console.log(this.props.questions);
            //  this.setState({questions: questions});
            
         } 
         getquestionsfollowed = async() => {
          this.setState({isDefaultTopic : false});
          let userid = localStorage.getItem("userid");
          console.log(userid);
          await this.props.getquestionsfollowed(userid);
        console.log(this.props.questionsfollowed); 
         }

         getuseranswers = async() => {
          this.setState({isDefaultTopic : false});
          let owner_name = localStorage.getItem("username");
          console.log(owner_name);
          await this.props.getuseranswers(owner_name);
        console.log(this.props.useranswers);
         }
        //search
        // componentDidMount() {
        //     this.setState({
        //       users: users
        //     });
        //     this.refs.search.focus();
        //   }
          handleChange(e) {
              e.preventDefault();
              const obj={
               searchString: this.state.searchString,   
              }
              axios.get('/topics',obj)
              .then(res => console.log(res.data))
            this.setState({
              searchString: this.refs.search.value
            });
          }
        
    render(){
        
        const questionsasked = this.props.questionsasked;
        console.log(questionsasked);
       const questionsfollowed=this.props.questionsfollowed;
       console.log(questionsfollowed);
         const useranswers =this.props.useranswers;
         console.log(useranswers);


        let _users = this.state.users;
        let search = this.state.searchString.trim().toLowerCase();
    
        if (search.length > 0) {
          _users = _users.filter(function(user) {
            return user.name.toLowerCase().match(search);
          });
        }
            
        return(
            <div>
            <Header/>
        
                    <div class="style">
                
                <h6>Your Content</h6>
                
                    </div>
                    
                           <ul>
                    <h6>By Content Type</h6>
                            <label>All Types</label>
                                  <br></br>
                            <label defaultActiveKey="test" onClick={this.getquestionsasked}>Question Asked</label>
                                  <br></br>
                            <label onClick={this.getquestionsfollowed}>Questions Followed</label>
                                  <br></br>
              
                             <label onClick={this.getuseranswers}>Answers</label>
                                  <br></br>
                                  <br></br>
                    <h6>By Topic</h6>
                             <h6>All topics</h6>
                             <div>
                   <input
                         type="text"
                         value={this.state.searchString}
                         ref="search"
                          onChange={this.handleChange}
                           placeholder="Search..."
                     />
          
        </div>
                             <br></br>
                    <h6>By Year</h6>
                    
             </ul>
                       
            {/* <ul>
             {_users.map(l => {
              return (
                <li>
                  {l.name} <a href="#">{l.email}</a>
                </li>
              );
            })}
            </ul>  */}
            <div class="yourcontent">
{/* content to be displayed */}
</div>




        </div>
        )
    }  
}

const mapStateToProps =(state)=>(
  {
 questionsasked: state.yourcontent.payload,
 questionsfollowed: state.yourcontent.payload,
 useranswers: state.yourcontent.payload,
  }
)
export default connect(mapStateToProps,{getquestionsasked,getquestionsfollowed,getuseranswers})(YourContent)