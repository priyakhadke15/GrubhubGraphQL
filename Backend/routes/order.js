var express = require('express');
var router = express.Router();
const uuidv4 = require('uuid/v4');
const jwt = require("jsonwebtoken");
const { jwtsecret } = require('../config');

const { getOrders, saveOrder, editOrder } = require('../DAL');
const { getOrderDetails, saveOrderDetails } = require('../DAL');
const { getItems } = require('../DAL');
const { getRestaurants } = require('../DAL');
const { getPersons } = require('../DAL');
// get the order list for past orders and upcoming orders  etc
router.get('/', async function (req, res, next) {
    let order = '', Restresult = '', person = '';
    const { orderID, restaurantId, orderDate, deliveryAdd, status, price } = req.query;
    //check if user is logged in
    if (!(req.cookies.authCookie)) {
        console.error("Unauthorised access");
        return res.status(401).json({ message: "please login to continue" });
    }
    try {
        const user = jwt.verify(req.cookies.authCookie, jwtsecret);
        if (user.isSeller) {
            const { results } = await getRestaurants({ ownerId: user.id });
            if (results.length == 0) { return res.send({}); }
            else {
                Restresult = JSON.parse(JSON.stringify(results[0]))
                order = {
                    restaurantId: Restresult.restaurantId,
                    orderID, orderDate, deliveryAdd, status, price
                };
            }
        }
        else {
            order = {
                buyerId: user.id,
                orderID, restaurantId, orderDate, deliveryAdd, status, price
            };
        }
        const { results: queryResult } = await getOrders(order);
        if (user.isSeller) {
            if (queryResult.length == 0) { return res.send({ orders: [], persons: [] }); }
            Restresult = JSON.parse(JSON.stringify(queryResult[0]))
            person = {
                id: Restresult.buyerId
            }
            const { results: personResult } = await getPersons(person);
            orderResults = { orders: queryResult, persons: personResult };

        }
        else {
            orderResults = { orders: queryResult, persons: [] };
        }

        return res.json(orderResults);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
//get orderdetails for detailed view
router.get('/details', async function (req, res, next) {

    const { orderID } = req.query;
    //check if user is logged in
    if (!(req.cookies.authCookie)) {
        console.error("Unauthorised access");
        return res.status(401).json({ message: "please login to continue" });
    }
    try {
        const orderdetail = {
            orderID
        };
        const { results } = await getOrderDetails(orderdetail);
        res.json(results);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
//submit the buyer's order
/* item input in format [
    {"itemID":"cdf5b752-4b43-4457-adf6-81d83835bf65","quantity":"2"},
    {"itemID":"cdf5b752-4b43-4457-adf6-81d83835bf66","quantity":"1"}
]
*/
router.post('/', async function (req, res, next) {
    const { authCookie } = req.cookies;
    var total = 0, ordertotal = 0;
    var randNum = uuidv4();
    const { items, restaurantId, deliveryAdd } = req.body;
    // const itemjson = JSON.parse(items);
    const itemjson = items;

    try {
        //check if user is logged in
        if (!authCookie || !jwt.verify(authCookie, jwtsecret)) {
            console.error("Unauthorised access");
            return res.status(401).json({ message: "please login to continue" });
        }
    } catch (e) {
        res.status(401).json({ message: e.message });
    }
    //check items are selected
    if (itemjson.length == 0) {
        console.error("No item selected");
        return res.status(400).json({ message: "please select atleast one item" });
    }

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;
    var curr_year = d.getFullYear();
    var seconds = d.getSeconds();
    var minutes = d.getMinutes();
    var hour = d.getHours();

    try {
        const user = jwt.verify(authCookie, jwtsecret);
        //get item price for each item and calculate order price
        for (var i = 0; i < itemjson.length; i++) {
            const { itemID, quantity } = itemjson[i];
            const item = { itemID };
            const { results } = await getItems(item);
            Restresult = JSON.parse(JSON.stringify(results[0]))
            total = Restresult.price * quantity;

            const orderdetail = {
                orderID: randNum,
                itemprice: Restresult.price,
                totalprice: total,
                itemID, quantity
            };
            await saveOrderDetails(orderdetail);
            ordertotal += total;
        }

        const order = {
            orderID: randNum,
            buyerId: user.id,   //buyer's userid is fetched from authcookie
            orderDate: (curr_year + '-' + curr_month + '-' + curr_date + ' ' + hour + ':' + minutes + ':' + seconds),
            status: 'new',
            price: Math.round(ordertotal * 100) / 100,
            restaurantId, deliveryAdd
        };
        const { results: queryResult } = await saveOrder(order);
        res.json(queryResult);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
router.put('/', async function (req, res, next) {
    const { orderID, status } = req.body;
    //check if user is logged in
    if (!(req.cookies.authCookie)) {
        console.error("Unauthorised access");
        return res.status(401).json({ message: "please login to continue" });
    }
    try {
        const user = jwt.verify(req.cookies.authCookie, jwtsecret);
        //check if user is seller 
        if (!user.isSeller) {
            console.error("Unauthorised access");
            return res.status(403).json({ message: "Permission needed" });
        }
        //check if the logged in user is owner of restaurant for which order is received
        let order = { orderID };
        const { results } = await getOrders(order);
        const restDetail = JSON.parse(JSON.stringify(results[0]));
        const { results: restOwner } = await getRestaurants({ ownerId: user.id });
        const ownerRest = JSON.parse(JSON.stringify(restOwner[0]));

        if (restDetail.restaurantId !== ownerRest.restaurantId) {
            console.error("Forbidden");
            return res.status(403).json({ message: "Forbidden" });
        }
        order = {
            orderID, status
        };
        await editOrder(order);
        res.json({ message: "Details updated" });
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
module.exports = router;