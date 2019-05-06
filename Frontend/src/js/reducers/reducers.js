import { combineReducers } from 'redux';
import  AccountReducer from './accountReducers';
import QuestionReducer from './questionReducer';
import MessageReducer from './messageReducer';
import { reducer as formReducer } from "redux-form";
import GraphReducer from './graphReducer';
import ProfileReducer from './profileReducer';

const rootReducer = combineReducers({
    question: QuestionReducer,
    account: AccountReducer,
    form: formReducer,
    message: MessageReducer,
    graph: GraphReducer,
    profile: ProfileReducer
});

export default rootReducer;
