module.exports = {
    jwtsecret: "",
    encrAlgorithm: "",
    encrSecret: "",
    sql_host: '',
    sql_port: "",
    sql_user: '',
    sql_password: '',
    sql_database: '',
    sql_connectionLimit: 50,
    initDb: process.env.INITDB === "true"
};
