import { SIGN_IN,SIGN_OUT,SIGN_UP,SELECTED_TOPICS } from "../constants/action-types";

// actions for sign up
export function signup(formdata) {
  console.log("Inside Action.js")
  return (dispatch)=>{
  fetch('/account/signup',{
      body: formdata,
      method: 'PUT'
  })
  .then((response)=>response.json())
  .then((response)=>dispatch(signupUpdate(response)))
  }
}
function signupUpdate(returndata) {
  console.log("in signup update")
  console.log(returndata)
    return { type: SIGN_UP, payload:returndata}
}

// actions for sign in
export function signin(formdata){
    return (dispatch)=>{
      fetch('/account/signin',{
        body: formdata,
        method: 'POST'
    }).then(response => response.json())
    .then((response)=>dispatch(signinUpdate(response)))
    }
}
function signinUpdate(returndata) {
    if(returndata.signinSuccess) {
      localStorage.setItem("jwtToken",returndata.token)
      localStorage.setItem("user_name",returndata.user_name)
      localStorage.setItem("firstname",returndata.firstname)
      localStorage.setItem("lastname",returndata.lastname)
      localStorage.setItem("userid",returndata.userid)
      localStorage.setItem("topics",returndata.topics)
    }
    return { type: SIGN_IN, payload:returndata}
  }

// actions for sign out
export function signout(){
    return (dispatch) => {
      fetch('/logout',{
        method: 'GET'
      }).then(()=>dispatch(signoutUpdate()))
    }
}
function signoutUpdate(returndata) {
    localStorage.removeItem("jwtToken")
    localStorage.removeItem("userid")
    localStorage.removeItem("username")
    return { type: SIGN_OUT}
}

//actions for choose-topics
export function selectTopics(selectedTopics){
  return (dispatch) => {
    fetch('/account/selectedTopics',{
      method: 'POST',
      body: JSON.stringify({
        topics:selectedTopics,
        userid:localStorage.getItem('userid'),
        user_name:localStorage.getItem('user_name')
      }),
      headers:{
        'Authorization': "Bearer " + localStorage.getItem("jwtToken"),
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((response)=>dispatch(selectTopicsUpdate(response)))
  }
}
function selectTopicsUpdate(returndata) {
  // if(returndata.selectTopicsSuccess) {
  //   localStorage.setItem("selected_topics",returndata.selected_topics)
  // }
  console.log("Inside selectTopicsUpdate, returndata.topics : "+ returndata.topics)
  console.log("Inside selectTopicsUpdate, returndata : "+ returndata)
  if (localStorage.getItem('topics').length === 0){
    console.log("localStorage : ('topics').length === 0")
    localStorage.setItem("topics",returndata.topics)
  }
  return { type: SELECTED_TOPICS, payload:returndata}
}