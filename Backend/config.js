module.exports = {
    jwtsecret: "knuvv76u188zd2xu8c4xa",
    encrAlgorithm: "aes256",
    encrSecret: "1hmmp2sk8owpg8mtxxe8a",
    sql_host: '192.168.0.6',
    sql_port: "3306",
    sql_user: 'admin',
    sql_password: 'mypass',
    sql_database: 'GrubHub',
    sql_connectionLimit: 50,
    initDb: process.env.INITDB === "true"
};