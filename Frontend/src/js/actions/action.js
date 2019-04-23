import { SIGN_IN,SIGN_OUT,SIGN_UP } from "../constants/action-types";

// actions for sign up
export function signup(formdata) {
  return (dispatch)=>{
  fetch('/account/signup',{
      body: formdata,
      method: 'PUT'
  }).then((response)=>response.json())
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
      localStorage.setItem("userid",returndata.userid)
      localStorage.setItem("username",returndata.user_name)
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