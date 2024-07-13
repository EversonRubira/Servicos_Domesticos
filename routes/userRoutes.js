const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const db = require('../config/database'); 

// Rota de login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const user = { id: 1, email: "user@example.com", senha: "$2b$10$hash" };
    try {
        const match = await bcrypt.compare(senha, user.senha);
        if (match) {
            const token = jwt.sign(
                { userId: user.id, role: "admin" },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );
            res.json({ accessToken: token });
        } else {
            res.status(401).send('Credenciais inválidas');
        }
    } catch (error) {
        res.status(500).send('Erro interno do servidor');
    }
});

// Adicionar um novo usuário
router.post('/', [
    body('nome').not().isEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('E-mail inválido'),
    body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
    body('tipo').isIn(['cliente', 'prestador']).withMessage('Tipo de usuário inválido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { nome, email, senha, tipo } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);
    const query = 'INSERT INTO Users (nome, email, senha, tipo) VALUES (?, ?, ?, ?)';
    db.query(query, [nome, email, hashedPassword, tipo], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Erro ao adicionar usuário", error: err });
        }
        res.status(201).send({ message: "Usuário adicionado com sucesso", userId: result.insertId });
    });
});

module.exports = router;
