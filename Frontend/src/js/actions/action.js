import { SIGN_IN,SIGN_OUT,SIGN_UP,SELECTED_TOPICS,YOUR_QUESTIONS,YOUR_QUESTIONSFOLLOWED,YOUR_ANSWERS } from "../constants/action-types";

// actions for sign up
export function signup(formdata) {
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
      localStorage.setItem("fullname",returndata.firstname + " " +returndata.lastname )
      localStorage.setItem("firstname",returndata.firstname)
      localStorage.setItem("lastname",returndata.lastname)
      localStorage.setItem("userid",returndata.userid)
      localStorage.setItem("topics",returndata.topics)
      localStorage.setItem("b64","default")
      localStorage.setItem("isTopicSelected",returndata.isTopicSelected)
    }
    return { type: SIGN_IN, payload:returndata}
  }

// actions for sign out
export function signout(){
  localStorage.removeItem("jwtToken")
  localStorage.removeItem("userid")
  localStorage.removeItem("username")
  localStorage.clear();
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
  if (localStorage.getItem('topics').length === 0){
    localStorage.setItem("topics",returndata.topics)
    localStorage.setItem("isTopicSelected",returndata.isTopicSelected)
  }
  return { type: SELECTED_TOPICS, payload:returndata}
}

// actions for get questions asked (content page)
export function yourQuestions(data){
  console.log(data);
  return (dispatch) => {
    fetch('/content/questions_asked?userid='+data,{
      method: 'GET',
      headers:{
        'Authorization': "Bearer " + localStorage.getItem("jwtToken"),
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((response)=>dispatch(yourQuestionsUpdate(response)))
  }
}
function yourQuestionsUpdate(returndata) {
  return { type: YOUR_QUESTIONS, payload:returndata}
}

// actions for get questions followed (content page)
export function yourQuestionsFollowed(data){
  console.log(data);
  return (dispatch) => {
    fetch('/content/questions_followed?userid='+data,{
      method: 'GET',
      headers:{
        'Authorization': "Bearer " + localStorage.getItem("jwtToken"),
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((response)=>dispatch(yourQuestionsFollowedUpdate(response)))
  }
}
function yourQuestionsFollowedUpdate(returndata) {
  return { type: YOUR_QUESTIONSFOLLOWED, payload:returndata}
}

// actions for get questions answered (content page)
export function yourAnswers(data){
  console.log(data);
  return (dispatch) => {
    fetch('/content/questions_answered?userid='+data,{
      method: 'GET',
      headers:{
        'Authorization': "Bearer " + localStorage.getItem("jwtToken"),
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((response)=>dispatch(yourAnswersUpdate(response)))
  }
}
function yourAnswersUpdate(returndata) {
  return { type: YOUR_ANSWERS, payload:returndata}
}