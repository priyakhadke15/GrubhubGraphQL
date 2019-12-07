const _tableName = 'Orders';

const getOrders = connection => order => {
    const { orderID, restaurantId, buyerId, orderDate, deliveryAdd, status, price } = order;
    let query = `select * from ${_tableName} INNER JOIN Restaurants ON Orders.restaurantId = Restaurants.restaurantId `;

    const clause = [];
    if (orderID) {
        clause.push(`${_tableName}.orderID='${orderID}'`);
    }
    if (restaurantId) {
        clause.push(`${_tableName}.restaurantId='${restaurantId}'`);
    }
    if (buyerId) {
        clause.push(`${_tableName}.buyerId='${buyerId}'`);
    }
    if (orderDate) {
        clause.push(`${_tableName}.orderDate='${orderDate}'`);
    }
    if (deliveryAdd) {
        clause.push(`${_tableName}.deliveryAdd like '%${deliveryAdd}%'`);
    }
    if (status) {
        if (status == 'new') {
            clause.push(`${_tableName}.status IN ('new','preparing','ready')`);
        } else {
            clause.push(`${_tableName}.status IN ('delivered','cancel')`);
        }

    }
    if (price) {
        clause.push(`${_tableName}.price<='${price}'`);
    }
    query += clause.length > 0 ? ` where ${clause.join(' and ')}` : ''
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            // release connection first!
            connection.release();

            if (error) {
                reject(error);
            } else {
                resolve({ results, fields });
            }
        });
    });
};

//submit buyer's order in Order table
const saveOrder = connection => order => {
    const { orderID, restaurantId, buyerId, orderDate, deliveryAdd, status, price } = order;
    let query = `insert into ${_tableName} (orderID, restaurantId, buyerId, orderDate, deliveryAdd, status, price)` +
        `VALUES ('${orderID}', '${restaurantId}', '${buyerId}', '${orderDate}', '${deliveryAdd}', '${status}', ${price});`;
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            // release connection first!
            connection.release();
            if (error) {
                reject(error);
            } else {
                resolve({ results, fields });
            }
        });
    });
};
//owner should be able to cancel order
const editOrder = connection => order => {
    const { orderID, status } = order;
    let query = `update ${_tableName} set status='${status}' where orderID='${orderID}'`;
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            // release connection first!
            connection.release();
            if (error) {
                reject(error);
            } else {
                resolve({ results, fields });
            }
        });
    });

};
module.exports = {
    getOrders,
    saveOrder,
    editOrder
};