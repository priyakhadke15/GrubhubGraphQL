const _getCart = () => {
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : {};
    } catch (e) {
        return {};
    }
};

const _setCart = cart => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
        // do nothing
    }
};

export default (state, action) => {
    if (action.type === 'SETCART') {
        _setCart(action.payload.cart);
    }
    return _getCart();
};