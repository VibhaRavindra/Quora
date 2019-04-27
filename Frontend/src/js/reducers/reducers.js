import { combineReducers } from 'redux';
import  AccountReducer from './accountReducers';
import QuestionReducer from './questionReducer';
import { reducer as formReducer } from "redux-form";

const rootReducer = combineReducers({
    question: QuestionReducer,
    account: AccountReducer,
    form: formReducer
});

export default rootReducer;
