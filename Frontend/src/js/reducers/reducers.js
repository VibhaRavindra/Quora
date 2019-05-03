import { combineReducers } from 'redux';
import  AccountReducer from './accountReducers';
import QuestionReducer from './questionReducer';
import MessageReducer from './messageReducer';
import { reducer as formReducer } from "redux-form";

const rootReducer = combineReducers({
    question: QuestionReducer,
    account: AccountReducer,
    form: formReducer,
    message: MessageReducer
});

export default rootReducer;
