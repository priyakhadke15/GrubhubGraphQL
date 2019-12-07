const _tableName = 'OrderDetails';

const getOrderDetails = connection => orderdetail => {
    const { orderID } = orderdetail;
    let query = `select * from ${_tableName} INNER JOIN Items ON OrderDetails.itemID = 
    Items.itemID`;
    const clause = [];
    if (orderID) {
        clause.push(`orderID='${orderID}'`);
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
//submit buyer's order in OrderDetails table
const saveOrderDetails = connection => orderdetail => {
    const { orderID, itemprice, totalprice, itemID, quantity } = orderdetail;
    let query = `insert into ${_tableName} (orderID, itemID, quantity, itemprice, totalprice)` +
        `VALUES ('${orderID}', '${itemID}', '${quantity}', '${itemprice}', '${totalprice}');`;
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
    getOrderDetails,
    saveOrderDetails
};