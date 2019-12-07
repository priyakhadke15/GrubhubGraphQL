var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '..', 'uploads/') });
const { jwtsecret } = require('../config');

const { getRestaurants, saveRestaurant, editRestaurant } = require('../DAL')
const { getItems } = require('../DAL');
const { getOrders } = require('../DAL');
const { editSections } = require('../DAL');

// edit the owner's restaurant
router.put('/', upload.single('image'), async function (req, res, next) {
    const { name, address, cuisine, zipcode } = req.body;
    const image = req.file ? `/${req.file.filename}` : '';

    if (!(req.cookies.authCookie)) {
        console.error("Unauthorised access");
        return res.status(401).json({ message: "please login to continue" });
    }
    try {
        //get user id from authCookie
        const user = jwt.verify(req.cookies.authCookie, jwtsecret);
        //Object for restaurant to edit
        restaurant = {
            ownerId: user.id,
            name, image, address, cuisine, zipcode
        }
        await editRestaurant(restaurant);
        res.json({ message: "Details updated" });
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// get the item list for one restaurant
router.get('/item', async function (req, res, next) {
    let item, rest;
    const { restaurantId } = req.query;
    if (!(req.cookies.authCookie)) {
        console.error("Unauthorised access");
        return res.status(401).json({ message: "please login to continue" });
    }
    try {
        const user = jwt.verify(req.cookies.authCookie, jwtsecret);
        //if buyer is requesting item list
        if (!user.isSeller && restaurantId) {
            restaurant = {
                restaurantId
            }
        }
        else {
            //restaurant object to get the rest ID
            restaurant = {
                ownerId: user.id
            }
        }
        const { results } = await getRestaurants(restaurant);
        if (results.length == 0) {
            return res.json([]);
        }
        else {
            rest = results[0];
            //Object for item to search
            item = {
                restaurantId: rest.restaurantId
            }
            const { results: queryresult } = await getItems(item);
            return res.json(queryresult);
        }

    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
//get all orders for this restaurant
router.get('/order', async function (req, res, next) {
    if (!(req.cookies.authCookie)) {
        console.error("Unauthorised access");
        return res.status(401).json({ message: "please login to continue" });
    }
    try {
        const user = jwt.verify(req.cookies.authCookie, jwtsecret);
        if (!user.isSeller) {
            console.error("Unauthorised access");
            return res.status(401).json({ message: "please login to continue" });
        }
        //restaurant object to get the rest ID
        restaurant = {
            ownerId: user.id
        }
        const { results } = await getRestaurants(restaurant);
        if (results.length == 1) {
            rest = results[0];
        }
        //Object for item to search
        order = {
            restaurantId: rest.restaurantId
        }
        const { results: queryresult } = await getOrders(order);
        res.json(queryresult);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
//update sections based on old value and restaurantID
router.put('/section', async function (req, res, next) {
    const { secName, secNameOld } = req.body;
    if (!(req.cookies.authCookie)) {
        console.error("Unauthorised access");
        return res.status(401).json({ message: "please login to continue" });
    }
    try {
        const user = jwt.verify(req.cookies.authCookie, jwtsecret);
        if (!user.isSeller) {
            console.error("Unauthorised access");
            return res.status(401).json({ message: "please login to continue" });
        }
        //check owner is editing his restaurant
        const { results } = await getRestaurants({ ownerId: user.id });
        const ownerRest = JSON.parse(JSON.stringify(results[0]));

        const section = {
            restaurantId: ownerRest.restaurantId,
            secName,
            secNameOld
        };
        const { results: secquery } = await editSections(section);
        res.json(secquery);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;


