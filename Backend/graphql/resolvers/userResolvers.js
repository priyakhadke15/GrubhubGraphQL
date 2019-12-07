'use strict';
const { getPersons } = require('../../DAL');

module.exports = {
    Query: {
        persons: async (parent, person, { req }) => {
            const { results } = await getPersons(person);
            return results;
        }
    }
};