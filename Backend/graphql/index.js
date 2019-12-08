'use strict';

// require all typedefs
const userSchema = require('./typedefs/userSchema');
const itemSchema = require('./typedefs/itemSchema');
const orderDetailsSchema = require('./typedefs/orderDetailsSchema');

// require all resolvers
const userResolvers = require('./resolvers/userResolvers');
const itemResolvers = require('./resolvers/itemResolvers');
const orderDetailsResolvers = require('./resolvers/orderDetailsResolvers')

module.exports = {
    typeDefs: [userSchema, itemSchema, orderDetailsSchema],
    resolvers: [userResolvers, itemResolvers, orderDetailsResolvers]
};