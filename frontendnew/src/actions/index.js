export const login = () => ({ type: 'LOGIN' });

export const logout = () => ({ type: 'LOGOUT' });

export const signup = email => ({ type: 'SIGNUP', payload: { email } });

export const getCart = () => ({ type: 'GETCART' });

export const setCart = cart => ({ type: 'SETCART', payload: { cart } });