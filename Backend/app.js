var createError = require('http-errors');
var express = require('express');
const { typeDefs, resolvers } = require('./graphql');
const { ApolloServer } = require('apollo-server-express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const jwt = require('jsonwebtoken');
const { initDb, jwtsecret } = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var restaurantRouter = require('./routes/restaurant');
var itemRouter = require('./routes/item');
var orderRouter = require('./routes/order');
const { getPersons } = require('./DAL');

var app = express();

const { createTables } = require('./DAL');

// create tables if db is not initialized
if (initDb) {
  (async () => {
    try {
      const { results } = await createTables();
      console.log(JSON.stringify(results, null, 4));
    } catch (e) {
      console.error('error in db init', e);
    }
  })();
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

const apiVersion = 'v1';

app.use('/', indexRouter);
app.use(`/api/${apiVersion}/users`, usersRouter);
app.use(`/api/${apiVersion}/restaurant`, restaurantRouter);
app.use(`/api/${apiVersion}/item`, itemRouter);
app.use(`/api/${apiVersion}/order`, orderRouter);
app.use(async (req, res, next) => {
  const { authCookie } = req.cookies;
  if (!authCookie) {
    return res.status(401).json({ message: "please login to continue" });
  }

  try {
    const { id } = jwt.verify(authCookie, jwtsecret);
    const { results } = await getPersons({ id });
    if (!Array.isArray(results) || results.length !== 1) {
      throw new Error(`user ${id} not found`);
    }
    const [user] = results;
    delete user.password;
    req.user = user;
  } catch (e) {
    delete req.cookies.authCookie;
    return res.status(401).json({ message: "please login to continue" });
  }
  next();
});
new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })
}).applyMiddleware({ app, path: "/graphql", cors: false });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;