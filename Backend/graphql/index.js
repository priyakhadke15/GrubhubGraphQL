'use strict';

// require all typedefs
const userSchema = require('./typedefs/userSchema');

// require all resolvers
const userResolver = require('./resolvers/userResolvers');

module.exports = {
    typeDefs: [userSchema],
    resolvers: [userResolver]
};