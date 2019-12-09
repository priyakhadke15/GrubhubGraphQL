'use strict';
const { getItems, saveItem, getRestaurants } = require('../../DAL');
const uuidv4 = require('uuid/v4');

module.exports = {
    Query: {
        items: async (parent, item, { req }) => {
            const { results } = await getItems(item);
            return results;
        }
    },
    Mutation: {
        item: async (parent, item, { req }) => {
            if (Object.keys(item).length > 0) {
                let rest;
                const restaurant = {
                    ownerId: req.user.id
                }
                const { results } = await getRestaurants(restaurant);
                if (results.length == 1) {
                    rest = results[0];
                }
                item.itemID = uuidv4();
                item.restaurantId = rest.restaurantId;
                await saveItem(item);
            }
            return item;
        }
    }
};