require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// Importa rotas
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes'); // Importar as rotas de serviços

// Conexão com o banco de dados
const db = require('./config/database');

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public'))); // Ajuste conforme a localização correta

// Middleware para parsear JSON e urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usando os routers
app.use('/users', userRoutes); // Usando o router de usuários com prefixo
app.use('/services', serviceRoutes); // Usando o router de serviços com prefixo

// Rota para servir a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota adicional para servir a página de login
app.get('/login_register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login_register.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
