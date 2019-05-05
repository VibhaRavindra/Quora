import { SIGN_IN,SIGN_OUT,SIGN_UP,SELECTED_TOPICS,YOUR_QUESTIONS,YOUR_QUESTIONSFOLLOWED,YOUR_ANSWERS } from "../constants/action-types";

const initialState = {
    signupSuccess:null,
    signupMessage: null,
    signinSuccess: null,
    signinMessage: null,
    selectTopicsSuccess: false,
    isTopicSelected: false,
    questionsAskedSuccess: false,
    questions_asked_array: [],
    questionsFollowedSuccess: false,
    questions_followed_array: [],
    questionsAnsweredSuccess: false,
    questions_answered_array: []
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
    } else if(action.type === YOUR_QUESTIONS) {
        return Object.assign({}, state, {
            questionsAskedSuccess:action.payload.questionsAskedSuccess,
            questions_asked_array:action.payload.questions_asked_array
        });
    } else if (action.type === YOUR_QUESTIONSFOLLOWED){
        return Object.assign({}, state, {
            questionsFollowedSuccess:action.payload.questionsFollowedSuccess,
            questions_followed_array:action.payload.questions_followed_array
        });
    } else if (action.type === YOUR_ANSWERS) {
        return Object.assign({}, state, {
            questionsAnsweredSuccess:action.payload.questionsAnsweredSuccess,
            questions_answered_array:action.payload.questions_answered_array
        });
    }
    return state;
}