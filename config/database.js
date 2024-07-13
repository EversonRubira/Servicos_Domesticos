const mysql = require('mysql');
require('dotenv').config();

const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

dbConnection.connect(error => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        return;
    }
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
});

module.exports = dbConnection;
