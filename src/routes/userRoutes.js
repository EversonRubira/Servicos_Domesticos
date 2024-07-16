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
router.post('/user', [
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
    const query = 'INSERT INTO users (nome, email, senha, tipo) VALUES (?, ?, ?, ?)';
    db.query(query, [nome, email, hashedPassword, tipo], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Erro ao adicionar usuário", error: err });
        }
        return res.status(201).send({ message: "Usuário adicionado com sucesso", userId: result.insertId });
    });
});


// Recuperar usuario pelo email
router.get('/user/:email', (req, res) => {
    const query = 'SELECT * FROM users where email = ?';
    db.query(query, [req.params.email], function (err, rows) {
        if (err) {
            return res.status(500).send({ message: "Erro ao buscar serviços", error: err });
        }
       
        return res.status(200).json({"message": "success", "user": rows[0] });
    });
});

// Recuperar todos
router.get('/user', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, function (err, rows) {
        if (err) {
            return res.status(500).send({ message: "Erro ao buscar serviços", error: err });
        }
       
        return res.status(200).json({"message": "success", "users": rows });
    });
});


router.delete('/user/:id', 
    async (req, res) => {
    const query = "DELETE FROM projetofinalpw.users WHERE id = ?";
    db.query(query, [req.params.id], function (err, result) {
      if (err) {
        return res.status(400).json({"message": "error", "error": err });
      } else {
        return res.status(200).json({"message": "success", "userId": req.params.id });
      }
    });
});

module.exports = router;
