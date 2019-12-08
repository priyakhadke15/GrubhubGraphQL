'use strict';
const { gql } = require('apollo-server');

module.exports = gql`
    type OrderDetails {
        iDesc: String,
        iImage: String,
        itemID: ID,
        itemName: String
        itemprice: Float,
        orderID: ID,
        price: Float,
        quantity: Int,
        restaurantId: ID,
        secName: String,
        totalprice: Float
    }

    extend type Query {
        orderdetails(orderID: ID!): [OrderDetails]
    }
`;