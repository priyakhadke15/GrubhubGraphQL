const mysql = require('mysql');
// const faker = require('faker');
const { sql_host, sql_port, sql_user, sql_password, sql_database, sql_connectionLimit } = require('../config');

const { createTables } = require('./init');
const { getPersons, savePerson, editPerson } = require('./persons');
const { getItems, saveItem, editItem, delItem } = require('./items');
const { getRestaurants, saveRestaurant, editRestaurant } = require('./restaurants');
const { getOrders, saveOrder, editOrder } = require('./orders');
const { getOrderDetails, saveOrderDetails } = require('./orderdetails');
const { editSections } = require('./items');

const pool = mysql.createPool({
    connectionLimit: sql_connectionLimit,
    host: sql_host,
    port: sql_port,
    user: sql_user,
    password: sql_password,
    database: sql_database,
    multipleStatements: true
});

const getConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            console.log()
            return err ? reject(err) : resolve(connection);
        });
    });
};

const _createTables = async () => {
    const conn = await getConnection();
    return createTables(conn);
};

const _getPersons = async whereClause => {
    const conn = await getConnection();
    return getPersons(conn)(whereClause);
};

const _savePerson = async person => {
    const conn = await getConnection();
    return savePerson(conn)(person);
};

const _editPerson = async person => {
    const conn = await getConnection();
    return editPerson(conn)(person);
};


const _getItems = async id => {
    const conn = await getConnection();
    return getItems(conn)(id);
};

const _saveItem = async item => {
    const conn = await getConnection();
    return saveItem(conn)(item);
};

const _editItem = async item => {
    const conn = await getConnection();
    return editItem(conn)(item);
};

const _delItem = async item => {
    const conn = await getConnection();
    return delItem(conn)(item);
};


const _getRestaurants = async id => {
    const conn = await getConnection();
    return getRestaurants(conn)(id);
};

const _saveRestaurant = async restaurant => {
    const conn = await getConnection();
    return saveRestaurant(conn)(restaurant);
};
const _editRestaurant = async restaurant => {
    const conn = await getConnection();
    return editRestaurant(conn)(restaurant);
};
const _editSections = async section => {
    const conn = await getConnection();
    return editSections(conn)(section);
};

const _getOrders = async order => {
    const conn = await getConnection();
    return getOrders(conn)(order);
};
const _saveOrder = async order => {
    const conn = await getConnection();
    return saveOrder(conn)(order);
};
const _editOrder = async order => {
    const conn = await getConnection();
    return editOrder(conn)(order);
};
const _getOrderDetails = async orderdetail => {
    const conn = await getConnection();
    return getOrderDetails(conn)(orderdetail);
};
const _saveOrderDetails = async orderdetail => {
    const conn = await getConnection();
    return saveOrderDetails(conn)(orderdetail);
};

module.exports = {
    createTables: _createTables,
    getPersons: _getPersons,
    savePerson: _savePerson,
    editPerson: _editPerson,
    getItems: _getItems,
    saveItem: _saveItem,
    editItem: _editItem,
    delItem: _delItem,
    getRestaurants: _getRestaurants,
    saveRestaurant: _saveRestaurant,
    editRestaurant: _editRestaurant,
    editSections: _editSections,
    getOrders: _getOrders,
    editOrder: _editOrder,
    getOrderDetails: _getOrderDetails,
    saveOrderDetails: _saveOrderDetails,
    saveOrder: _saveOrder
};