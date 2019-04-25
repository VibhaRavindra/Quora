import { SIGN_IN,SIGN_OUT,SIGN_UP,SELECTED_TOPICS } from "../constants/action-types";

const initialState = {
    signupSuccess:null,
    signupMessage: null,
    signinSuccess: null,
    signinMessage: null,
    selectTopicsSuccess: null,
    select_topics: null
  };
export default function accountReducer(state = initialState, action) {
    console.log("in account reducer")
    if(action.type === SIGN_UP) {
        console.log("Inside Reducer signup : ",action.payload.signupSuccess);
        console.log(action.payload.signupMessage)
        return Object.assign({}, state, {
            signupSuccess:action.payload.signupSuccess,
            signupMessage:action.payload.signupMessage,
            signinSuccess:null,
            signinMessage:null
        });
    } else if(action.type === SIGN_IN) {
        return Object.assign({}, state, {
            signinSuccess:action.payload.signinSuccess,
            signinMessage:action.payload.signinMessage,
            signupSuccess:null,
            signupMessage:null,
            select_topics:action.payload.select_topics
        });
    } else if(action.type === SIGN_OUT) {
        return initialState;
    } else if(action.type === SELECTED_TOPICS) {
        console.log("Inside Reducer");
        console.log("selectTopicsSuccess : "+ action.payload.selectTopicsSuccess);
        return Object.assign({}, state, {
            selectTopicsSuccess:action.payload.selectTopicsSuccess,
            select_topics:action.payload.select_topics
        });
    }
    return state;
}