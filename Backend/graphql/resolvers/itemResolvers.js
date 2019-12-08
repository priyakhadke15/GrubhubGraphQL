'use strict';
const { getItems } = require('../../DAL');

module.exports = {
    Query: {
        items: async (parent, item, { req }) => {
            const { results } = await getItems(item);
            return results;
        }
    }
};