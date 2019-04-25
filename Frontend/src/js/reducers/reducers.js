import { combineReducers } from 'redux';
import  AccountReducer from './accountReducers';
import { reducer as formReducer } from "redux-form";

const rootReducer = combineReducers({
    account: AccountReducer,
    form: formReducer
});

export default rootReducer;
