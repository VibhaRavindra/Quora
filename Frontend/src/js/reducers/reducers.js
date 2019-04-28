import { combineReducers } from 'redux';
import  AccountReducer from './accountReducers';
import QuestionReducer from './questionReducer';
import Yourcontent from './yourcontent';
import { reducer as formReducer } from "redux-form";

const rootReducer = combineReducers({
    question: QuestionReducer,
    account: AccountReducer,
    form: formReducer,
    yourcontent:Yourcontent
});

export default rootReducer;
