import { SIGN_IN,SIGN_OUT,SIGN_UP } from "../constants/action-types";

const initialState = {
    signupSuccess:null,
    signupMessage: null,
    signinSuccess: null,
    signinMessage: null
  };
function rootReducer(state = initialState, action) {
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
            signupMessage:null
        });
    } else if(action.type === SIGN_OUT) {
        return initialState;
    }
    return state;
}
export default rootReducer;