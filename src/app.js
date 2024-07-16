require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// Importa rotas
const router = require('./routes/userRoutes');

// Conexão com o banco de dados
const db = require('./config/database');

// Middleware para servir arquivos estáticos da pasta 'public'
// Certifique-se de que o caminho esteja correto conforme a localização da pasta 'public' em relação a este arquivo
app.use(express.static(path.join(__dirname, '../public')));

// Middleware para parsear JSON e urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usando o router
app.use(router);

// Rota para servir a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Rota adicional para servir a página de login
app.get('/login_register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login_register.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app