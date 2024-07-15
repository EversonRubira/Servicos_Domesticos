require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const authMiddleware = require('./middleware/authMiddleware');

// Middleware para logs de requisição
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Importa rotas
const router = require('./routes/userRoutes');

// Conexão com o banco de dados
const db = require('./config/database');

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON e urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usando o router
app.use(router);

// Rota para servir a página inicial
app.get('/', (req, res) => {
    console.log('Servindo a página inicial');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota adicional para servir a página de login e registro
app.get('/login.html', (req, res) => {
    console.log('Servindo a página de login');
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota para o dashboard, com autenticação
app.get('/dashboard', authMiddleware, (req, res) => {
    console.log(`Acessando dashboard para o tipo de usuário: ${req.user.type}`);
    if (req.user.type === 'admin') {
        res.sendFile(path.join(__dirname, 'public', 'admin_dashboard.html'));
    } else if (req.user.type === 'provider') {
        res.sendFile(path.join(__dirname, 'public', 'provider_dashboard.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'client_dashboard.html'));
    }
});

// Middleware de erro para capturar e logar erros
app.use((err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    res.status(500).send('Ocorreu um erro no servidor');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


// Rota acessível apenas por administradores
app.get('/admin-dashboard', authenticateToken, checkRole('admin'), (req, res) => {
    console.log('Acessando o dashboard de administrador');
    res.sendFile(path.join(__dirname, 'public', 'admin_dashboard.html'));
});

// Rota acessível apenas por prestadores de serviços
app.get('/provider-dashboard', authenticateToken, checkRole('provider'), (req, res) => {
    console.log('Acessando o dashboard do prestador de serviços');
    res.sendFile(path.join(__dirname, 'public', 'provider_dashboard.html'));
});

// Rota acessível apenas por clientes
app.get('/client-dashboard', authenticateToken, checkRole('client'), (req, res) => {
    console.log('Acessando o dashboard do cliente');
    res.sendFile(path.join(__dirname, 'public', 'client_dashboard.html'));
});
