// Importando as dependências necessárias
const mysql = require('mysql');
require('dotenv').config();  // Para carregar as configurações do arquivo .env

// Configurando a conexão com o banco de dados
const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Conectando ao banco de dados
dbConnection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1);  // Sai do processo se houver erro
    } else {
        console.log("Conexão com o banco de dados estabelecida com sucesso!");
        // Realiza uma consulta simples para testar a conexão
        dbConnection.query('SELECT 1 + 1 AS result', (error, results, fields) => {
            if (error) throw error;
            console.log('Resultado da consulta: ', results[0].result);  // Deve ser 2
            dbConnection.end();  // Encerra a conexão
        });
    }
});
