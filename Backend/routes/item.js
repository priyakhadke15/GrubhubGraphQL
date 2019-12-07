var express = require('express');
var router = express.Router();
const uuidv4 = require('uuid/v4');
const jwt = require("jsonwebtoken");
const { jwtsecret } = require('../config');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '..', 'uploads/') });

const { getRestaurants, saveRestaurant, editRestaurant } = require('../DAL')
const { getItems, saveItem, editItem, delItem } = require('../DAL')

// get the item list for searching
router.get('/', async function (req, res, next) {
    let item;
    const { itemName, iDesc, price, secName, itemID } = req.query;
    if (!(req.cookies.authCookie)) {
        console.error("Unauthorised access");
        return res.status(401).json({ message: "please login to continue" });
    }
    try {
        //Object for item to search
        item = {
            itemName, iDesc, price, secName, itemID
        }
        const { results } = await getItems(item);
        res.json(results);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
// add item 
router.post('/', upload.single('itemImage'), async function (req, res, next) {
    let rest;
    const { itemName, iDesc, price, secName } = req.body;
    const iImage = req.file ? `/${req.file.filename}` : '';
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
        const item = {
            itemID: uuidv4(),
            restaurantId: rest.restaurantId,
            itemName, iDesc, price, iImage, secName
        }
        await saveItem(item);
        res.json({ message: "Details updated" });
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
// edit item 
router.put('/', upload.single('itemImage'), async function (req, res, next) {
    let rest;
    const { itemID, itemName, iDesc, price, secName } = req.body;
    const iImage = req.file ? `/${req.file.filename}` : '';
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
        const item = { itemID, itemName, iDesc, price, iImage, secName }
        await editItem(item);
        res.json({ message: "Details updated" });
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
//delete item
router.delete('/', async function (req, res, next) {
    const { itemID } = req.query;
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
        const item = { itemID }
        await delItem(item);
        return res.json({ message: "Details updated" });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
});
module.exports = router;