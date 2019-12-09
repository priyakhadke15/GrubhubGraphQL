'use strict';
const { getPersons, editPerson } = require('../../DAL');

module.exports = {
    Query: {
        persons: async (parent, person, { req }) => {
            const { results } = await getPersons(person);
            return results;
        },
        profile: (parent, person, { req }) => req.user
    },
    Mutation: {
        profile: async (parent, person, { req }) => {
            if (Object.keys(person).length > 0) {
                person.id = req.user.id;
                await editPerson(person);
            }
            return req.user;
        }
    }
};