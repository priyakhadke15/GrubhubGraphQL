'use strict';

// require all typedefs
const userSchema = require('./typedefs/userSchema');
const itemSchema = require('./typedefs/itemSchema');

// require all resolvers
const userResolvers = require('./resolvers/userResolvers');
const itemResolvers = require('./resolvers/itemResolvers');

module.exports = {
    typeDefs: [userSchema, itemSchema],
    resolvers: [userResolvers, itemResolvers]
};