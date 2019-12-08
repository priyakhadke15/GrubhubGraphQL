'use strict';
const { getPersons } = require('../../DAL');

module.exports = {
    Query: {
        persons: async (parent, person, { req }) => {
            const { results } = await getPersons(person);
            return results;
        },
        profile: async (parent, person, { req }) => {
            console.log(req.user);
            return req.user;
        }
    }
};