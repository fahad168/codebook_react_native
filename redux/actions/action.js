import { LOGIN_USER, LOGOUT_REQUEST } from "./types";

export function userLogin(obj, token) {
    return {
        type: LOGIN_USER,
        payload: { obj, token }
    };
}

export function Logout() {
    return {
        type: LOGOUT_REQUEST
    };
}
