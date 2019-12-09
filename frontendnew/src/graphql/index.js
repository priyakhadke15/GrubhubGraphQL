'use strict';

// require all typedefs
const { getPersonsQuery, editProfileMutation } = require('./userSchema');
const { getorderdetailsQuery } = require('./orderDetailsSchema');
const { getIemsQuery, getMenuQuery, editItemMutation } = require('./itemSchema');

module.exports = {
    getPersonsQuery,
    editProfileMutation,
    getorderdetailsQuery,
    getIemsQuery,
    getMenuQuery,
    editItemMutation
};