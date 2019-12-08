'use strict';

// require all typedefs
const { getPersonsQuery } = require('./userSchema');
const { getorderdetailsQuery } = require('./orderDetailsSchema');

module.exports = {
    getPersonsQuery,
    getorderdetailsQuery
};