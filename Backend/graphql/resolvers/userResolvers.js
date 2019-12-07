'use strict';
const { getPersons } = require('../../DAL');

module.exports = {
    Query: {
        persons: async () => {
            const { results } = await getPersons();
            return results;
        }
    }
};