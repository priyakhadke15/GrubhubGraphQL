'use strict';
const { getPersons } = require('../../DAL');

module.exports = {
    Query: {
        persons: async (parent, person) => {
            const { results } = await getPersons(person);
            return results;
        }
    }
};