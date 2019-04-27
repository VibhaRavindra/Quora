import React from 'react'
import axios from 'axios'
import Header from '../Navigation/Header'
import "../../Styles/YourContent.css"
class YourContent extends React.Component{
    constructor(){
        super();
 this.state ={
     questionsasked:'',
     questionsfollowed:'',
     useranswers:'',
     questionsasked1:[
   "what is the value of pi?",
     ],
     questionsfollowed1:[
       "what if earth has no oceans?"  
     ],
     
      searchString: '',
      users: []
 }
 this.questionsasked=this.questionsasked.bind(this);
 this.questionsasked1=this.questionsasked1.bind(this);
 this.questionsfollowed=this.questionsfollowed.bind(this);
 this.questionsfollowed1=this.questionsfollowed1.bind(this);
 this.useranswers=this.useranswers.bind(this);
 this.handleChange = this.handleChange.bind(this);
}    
 questionsasked= (e) => {
            var headers = new Headers();
            e.preventDefault();
            
            axios.defaults.withCredentials = true;
             axios.get('/getuserquestions')
            .then((response) => {
                this.setState({
                    questionsasked: this.state.questionsasked.concat(response.data)
                });
                console.log(response.data)
            });
        }
        questionsasked1= (e) => {
            var headers = new Headers();
            e.preventDefault();
            
        
                this.setState({
                    questionsaskedd1: this.state.questionsasked1,
                });
                
        
        }
        questionsfollowed1= (e) => {
            var headers = new Headers();
            e.preventDefault();
            
        
                this.setState({
                    questionsfollowedd1: this.state.questionsfollowed1,
                });
                
        
        }
        questionsfollowed= (e) => {
            var headers = new Headers();
            e.preventDefault();
            
            axios.defaults.withCredentials = true;
             axios.get('/getfollowedquestions')
            .then((response) => {
                this.setState({
                    questionsfollowed: this.state.questionsfollowed.concat(response.data)
                });
                console.log(response.data)
            });
        }
        useranswers= (e) => {
            var headers = new Headers();
            e.preventDefault();
            
            axios.defaults.withCredentials = true;
             axios.get('/getuseranswers')
            .then((response) => {
                this.setState({
                    useranswers: this.state.useranswers.concat(response.data)
                });
                console.log(response.data)
            });
        }
        //search
        componentDidMount() {
            this.setState({
              users: users
            });
            this.refs.search.focus();
          }
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
        
        let _users = this.state.users;
        let search = this.state.searchString.trim().toLowerCase();
    
        if (search.length > 0) {
          _users = _users.filter(function(user) {
            return user.name.toLowerCase().match(search);
          });
        }

        let q=this.state.questionsasked1;
        let f=this.state.questionsfollowed1
            
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
                            <label onClick={this.questionsasked1}>Question Asked</label>
                                  <br></br>
                            <label onClick={this.questionsfollowed1}>Questions Followed</label>
                                  <br></br>
              
                             <label onClick={this.useranswers}>Answers</label>
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
                       <div class="yourcontent">
            {/* <ul>
             {_users.map(l => {
              return (
                <li>
                  {l.name} <a href="#">{l.email}</a>
                </li>
              );
            })}
            </ul> */}
            
               {this.state.questionsaskedd1}
            
            <br></br>
              {this.state.questionsfollowedd1}
                      </div>
                     
              <br></br>

        </div>
        )
    }  
}
var users = [

    { name: 'Backbone.js', url: 'https://documentcloud.github.io/backbone/'},
    { name: 'AngularJS', url: 'https://angularjs.org/'},
    { name: 'jQuery', url: 'https://jquery.com/'},
    { name: 'Prototype', url: 'http://www.prototypejs.org/'},
    { name: 'React', url: 'https://facebook.github.io/react/'},
    { name: 'Ember', url: 'http://emberjs.com/'},
    { name: 'Knockout.js', url: 'https://knockoutjs.com/'},
    { name: 'Dojo', url: 'http://dojotoolkit.org/'},
    { name: 'Mootools', url: 'http://mootools.net/'},
    { name: 'Underscore', url: 'https://documentcloud.github.io/underscore/'},
    { name: 'Lodash', url: 'http://lodash.com/'},
    { name: 'Moment', url: 'https://momentjs.com/'},
    { name: 'Express', url: 'http://expressjs.com/'},
    { name: 'Koa', url: 'http://koajs.com/'},

];

export default YourContent