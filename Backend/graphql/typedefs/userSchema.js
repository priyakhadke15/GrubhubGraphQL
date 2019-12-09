'use strict';
const { gql } = require('apollo-server');

module.exports = gql`
    type Person {
        id: ID!
        email: String!,
        password: String,
        firstName: String!,
        lastName: String!,
        profileImage: String,
        isSeller: Boolean
    }

    type Query {
        persons(id: ID, email: String, password: String): [Person],
        profile: Person,
        login(email: String!, password: String!): Person
    }

    type Mutation {
        profile(email: String, firstName: String, lastName: String, password: String): Person
    }
`;