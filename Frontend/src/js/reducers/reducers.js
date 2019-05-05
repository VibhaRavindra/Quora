import { combineReducers } from 'redux';
import  AccountReducer from './accountReducers';
import QuestionReducer from './questionReducer';
import Yourcontent from './yourcontent';
import MessageReducer from './messageReducer';
import { reducer as formReducer } from "redux-form";
import GraphReducer from './graphReducer';

const rootReducer = combineReducers({
    question: QuestionReducer,
    account: AccountReducer,
    form: formReducer,
    yourcontent:Yourcontent
    message: MessageReducer,
    graph: GraphReducer
});

export default rootReducer;
