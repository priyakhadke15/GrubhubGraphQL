'use strict';
const { gql } = require('apollo-server');

module.exports = gql`
    type Item {
        itemID: ID!,
        restaurantId: String!,
        itemName: String!,
        iDesc: String,
        price: Float!,
        iImage: String,
        secName: String!,
        address: String,
        cuisine: String,
        image: String,
        name: String,
        ownerId: ID,
        zipcode: Int
    }

    extend type Query {
        items(itemID: ID, itemName: String): [Item]
    }
`;