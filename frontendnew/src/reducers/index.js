import loginReducer from './login';
import cartReducer from './cart';
import cookie from 'react-cookies';

export default (state = {}, action) => {
    let newAction;
    if (action && (action.type === 'LOGIN' || action.type === 'LOGOUT' || action.type === 'SIGNUP')) {
        newAction = { type: action.type, payload: action.payload };
    } else {
        newAction = { type: cookie.load('authCookie') ? 'LOGIN' : 'LOGOUT' };
    }
    return {
        userdata: loginReducer(state, newAction),
        cartdata: cartReducer(state, { type: action.type, payload: action.payload })
    }
};