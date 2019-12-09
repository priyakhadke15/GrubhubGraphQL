'use strict';

// require all typedefs
const { getPersonsQuery, loginQuery, editProfileMutation, signupMutation } = require('./userSchema');
const { getorderdetailsQuery } = require('./orderDetailsSchema');
const { getIemsQuery, getMenuQuery, editItemMutation } = require('./itemSchema');

module.exports = {
    getPersonsQuery,
    loginQuery,
    editProfileMutation,
    signupMutation,
    getorderdetailsQuery,
    getIemsQuery,
    getMenuQuery,
    editItemMutation
};