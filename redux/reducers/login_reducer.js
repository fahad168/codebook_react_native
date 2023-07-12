import { LOGIN_USER, LOGOUT_REQUEST } from "../actions/types";

const INITIAL_STATE = {
    isLogin: null,
    token: null,
    user: null,
};

const loginReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                isLogin: true,
                user: action.payload.obj,
                token: action.payload.token
            };
        case LOGOUT_REQUEST:
            return {
                ...state,
                isLogin: false,
            }
        default:
            return state;
    }
}

export default loginReducer;