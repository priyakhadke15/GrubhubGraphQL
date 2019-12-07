var express = require('express');
var router = express.Router();
const uuidv4 = require('uuid/v4');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '..', 'uploads/') });

const { jwtsecret, encrAlgorithm, encrSecret } = require('../config');
const { getPersons, savePerson, editPerson } = require('../DAL')
const { getRestaurants, saveRestaurant, editRestaurant } = require('../DAL')
const { getItems, saveItem, editItem } = require('../DAL')

// crypto (can be updated to use 'bcrypt' instead)
const _encrypt = password => {
  const cipher = crypto.createCipher(encrAlgorithm, encrSecret);
  let ciphered = cipher.update(password, 'utf8', 'hex');
  ciphered += cipher.final('hex');
  return ciphered;
};

const _decrypt = encrypted => {
  const decipher = crypto.createDecipher(encrAlgorithm, encrSecret);
  let deciphered = decipher.update(encrypted, 'hex', 'utf8');
  deciphered += decipher.final('utf8');
  return deciphered;
};


// get all users (test route)
router.get('/', async function (req, res, next) {
  try {
    const { results } = await getPersons();
    res.json(results);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

// save user (signup)
router.post('/', async (req, res, next) => {
  const { email, password, firstName, lastName, profileImage, restName, restZipCode } = req.body;
  const isSeller = req.body.isSeller === 'true' || req.body.isSeller === true;

  // make sure mandatory keys are present
  if (!(email && password && firstName && lastName)) {
    console.error('save users, mandatory buyer info missing');
    return res.status(400).json({ message: "mandatory buyer info missing" });
  }
  //check mandatory seller keys are present
  let restaurant = null;
  if (isSeller) {
    if (!(restName && restZipCode)) {
      console.error('save users, mandatory seller info missing');
      return res.status(400).json({ message: 'mandatory seller info missing ' });
    }
    else {
      restaurant = {
        restaurantId: uuidv4(),
        ownerId: uuidv4(),
        name: restName,
        address: '',
        cuisine: '',
        image: '',
        zipcode: restZipCode
      }
    }
  }

  const person = {
    id: restaurant ? restaurant.ownerId : uuidv4(),
    password: _encrypt(password),
    isSeller, email, firstName, lastName, profileImage
  }
  try {
    const { results } = await savePerson(person);
    isSeller && (await saveRestaurant(restaurant));
    res.json(results);
  } catch (e) {
    console.error('error creating a new user or restaurant', e);
    res.status(500).json({ message: e.message || e });
  }
});

// login
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    console.error('login, email/password missing');
    return res.status(400).json({ message: "invalid credentials" });
  }

  try {
    const { results } = await getPersons({ email, password: _encrypt(password) });
    if (results.length == 1) {
      const user = results[0];
      const authCookie = jwt.sign({
        id: user.id,
        email: user.email,
        isSeller: user.isSeller === 1
      }, jwtsecret, { expiresIn: "7d" });
      res.cookie('authCookie', authCookie, { maxAge: 604800000, httpOnly: false, path: '/' });
      return res.json(user);
    } else {
      console.error('login, no user found: bad credentials');
      return res.status(400).json({ message: "bad credentials" });
    }
  } catch (e) {
    console.error('error in login', e);
    res.status(500).json({ message: e.message || e });
  }
});

//profile
router.get('/profile', async (req, res, next) => {
  let restaurant, queryResult, Restresult, finalresult;

  if (!(req.cookies.authCookie)) {
    console.error("Unauthorised access");
    return res.status(401).json({ message: "please login to continue" });
  }

  try {
    const user = jwt.verify(req.cookies.authCookie, jwtsecret);
    if (user.isSeller) {
      restaurant = { ownerId: user.id };
      ({ results: queryResult } = await getRestaurants(restaurant));
      Restresult = JSON.parse(JSON.stringify(queryResult))[0];
    }

    const person = { email: user.email };
    const { results } = await getPersons(person);
    let Personresult = JSON.parse(JSON.stringify(results))[0];

    delete Personresult.password;
    if (Restresult) {
      finalresult = { ...Personresult, ...Restresult };
    }
    else {
      finalresult = { ...Personresult };
    }
    res.json(finalresult);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put('/profile', upload.single('profileImage'), async (req, res, next) => {
  let person;
  const { email, password, firstName, lastName } = req.body;
  const profileImage = req.file ? `/${req.file.filename}` : '';
  if (!(req.cookies.authCookie)) {
    console.error("Unauthorised access");
    return res.status(401).json({ message: "please login to continue" });
  }
  try {
    const user = jwt.verify(req.cookies.authCookie, jwtsecret);
    person = {
      id: user.id,
      email, password, firstName, lastName, profileImage
    }
    await editPerson(person);
    res.json({ message: "Details updated" });
  }
  catch (e) {
    res.status(500).json({ message: e.message });
  }
});
module.exports = router;
