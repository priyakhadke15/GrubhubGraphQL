'use strict';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { encrAlgorithm, encrSecret, jwtsecret } = require('../../config');
const { getPersons, editPerson } = require('../../DAL');

const _encrypt = password => {
    const cipher = crypto.createCipher(encrAlgorithm, encrSecret);
    let ciphered = cipher.update(password, 'utf8', 'hex');
    ciphered += cipher.final('hex');
    return ciphered;
};

module.exports = {
    Query: {
        persons: async (parent, person, { req }) => {
            const { results } = await getPersons(person);
            return results;
        },
        profile: (parent, person, { req }) => req.user,
        login: async (parent, { email, password }, { res }) => {
            try {
                const { results } = await getPersons({ email, password: _encrypt(password) });
                if (results.length == 1) {
                    const [user] = results;
                    const authCookie = jwt.sign({
                        id: user.id,
                        email: user.email,
                        isSeller: user.isSeller === 1
                    }, jwtsecret, { expiresIn: "7d" });
                    res.cookie('authCookie', authCookie, { maxAge: 604800000, httpOnly: false, path: '/' });
                    return user;
                } else {
                    console.error('login, no user found: bad credentials');
                    // return dummy user (no authCookie)
                    return {
                        id: "fake",
                        email: "fake",
                        firstName: "fake",
                        lastName: "fake"
                    };
                }
            } catch (e) {
                console.error('error in login', e);
                // return dummy user (no authCookie)
                return {
                    id: "fake",
                    email: "fake",
                    firstName: "fake",
                    lastName: "fake"
                };
            }
        }
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