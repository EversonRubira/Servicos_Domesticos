const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const router = express.Router();


// Criação de um novo serviço
router.post('/service', [
    body('nome').not().isEmpty().withMessage('Nome do serviço é obrigatório'),
    body('descricao').not().isEmpty().withMessage('Descrição é obrigatória'),
    body('preco').isDecimal().withMessage('Preço deve ser um valor decimal válido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { nome, descricao, preco } = req.body;
    const query = 'INSERT INTO services (nome, descricao, preco) VALUES (?, ?, ?)';
    db.query(query, [nome, descricao, preco], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Erro ao adicionar serviço", error: err });
        }
        res.status(201).send({ message: "Serviço adicionado com sucesso", serviceId: result.insertId });
    });
});

// Listar todos os serviços
router.get('/services', (req, res) => {
    db.query('SELECT * FROM services', (err, results) => {
        if (err) {
            return res.status(500).send({ message: "Erro ao buscar serviços", error: err });
        }
        res.status(200).json(results);
    });
});

router.get('/service/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM services WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Erro ao buscar serviço", error: err });
        }
        if (result.length === 0) {
            return res.status(404).send({ message: "Serviço não encontrado" });
        }
        res.status(200).json(result[0]);
    });
});

// Atualizar um serviço existente
router.put('/service/:id', [
    body('nome').optional().not().isEmpty().withMessage('Nome do serviço é obrigatório'),
    body('descricao').optional().not().isEmpty().withMessage('Descrição é obrigatória'),
    body('preco').optional().isDecimal().withMessage('Preço deve ser um valor decimal válido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { nome, descricao, preco } = req.body;
    const query = 'UPDATE services SET nome = ?, descricao = ?, preco = ? WHERE id = ?';
    db.query(query, [nome, descricao, preco, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Erro ao atualizar serviço", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Serviço não encontrado" });
        }
        res.status(200).send({ message: "Serviço atualizado com sucesso", serviceId: req.params.id });
    });
});

// Deletar um serviço
router.delete('/service/:id', async (req, res) => {
    const query = "DELETE FROM services WHERE id = ?";
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao deletar serviço", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Serviço não encontrado" });
        }
        res.status(200).send({ message: "Serviço deletado com sucesso", serviceId: req.params.id });
    });
});

module.exports = router;
