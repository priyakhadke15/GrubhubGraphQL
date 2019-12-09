'use strict';

// require all typedefs
const { getPersonsQuery, loginQuery, editProfileMutation } = require('./userSchema');
const { getorderdetailsQuery } = require('./orderDetailsSchema');
const { getIemsQuery, getMenuQuery, editItemMutation } = require('./itemSchema');

module.exports = {
    getPersonsQuery,
    loginQuery,
    editProfileMutation,
    getorderdetailsQuery,
    getIemsQuery,
    getMenuQuery,
    editItemMutation
};