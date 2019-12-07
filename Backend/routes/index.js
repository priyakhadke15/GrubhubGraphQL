var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const { jwtsecret } = require('../config');

var Users = [{
  username: "priya@abc.com",
  password: "admin"
}]

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function (req, res) {
  Users.filter(function (user) {
    if (user.username === req.body.username && user.password === req.body.password) {
      res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
      const authCookie = jwt.sign({
        username: user.username,
        isSeller: false
      }, jwtsecret, { expiresIn: "7d" });
      res.cookie('authCookie', authCookie, { maxAge: 900000, httpOnly: true, path: '/' });
      res.json({ message: 'Successful Login' })
    }
    else {
      res.status(400).json({ message: 'Invalid Credentials' });
    }
  })
});
module.exports = router;
