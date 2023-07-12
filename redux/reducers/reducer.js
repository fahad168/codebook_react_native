import { createStore } from "redux";
import loginReducer from './login_reducer';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    loginReducer,
});

export default rootReducer;