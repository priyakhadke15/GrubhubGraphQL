'use strict';
const { getOrderDetails } = require('../../DAL');

module.exports = {
    Query: {
        orderdetails: async (parent, orderDetails, { req }) => {
            const { results } = await getOrderDetails(orderDetails);
            return results;
        }
    }
};