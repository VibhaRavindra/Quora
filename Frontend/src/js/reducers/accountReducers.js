import { SIGN_IN,SIGN_OUT,SIGN_UP,SELECTED_TOPICS } from "../constants/action-types";

const initialState = {
    signupSuccess:null,
    signupMessage: null,
    signinSuccess: null,
    signinMessage: null,
    selectTopicsSuccess: false,
    isTopicSelected: false
  };
export default function accountReducer(state = initialState, action) {
    if(action.type === SIGN_UP) {
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
            isTopicSelected:action.payload.isTopicSelected
        });
    } else if(action.type === SIGN_OUT) {
        return initialState;
    } else if(action.type === SELECTED_TOPICS) {
        return Object.assign({}, state, {
            selectTopicsSuccess:action.payload.selectTopicsSuccess,
            select_topics:action.payload.select_topics
        });
    }
    return state;
}