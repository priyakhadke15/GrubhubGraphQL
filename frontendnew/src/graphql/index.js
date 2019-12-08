'use strict';

// require all typedefs
const { getPersonsQuery } = require('./userSchema');
const { getorderdetailsQuery } = require('./orderDetailsSchema');
const { getIemsQuery } = require('./itemSchema');

module.exports = {
    getPersonsQuery,
    getorderdetailsQuery,
    getIemsQuery
};