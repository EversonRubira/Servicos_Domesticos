const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const router = express.Router();


// Agendar um novo compromisso
router.post('/', [
    body('cliente_id').isInt().withMessage('ID do cliente é obrigatório e deve ser um número inteiro'),
    body('servico_id').isInt().withMessage('ID do serviço é obrigatório e deve ser um número inteiro'),
    body('prestador_id').isInt().withMessage('ID do prestador é obrigatório e deve ser um número inteiro'),
    body('data_hora').isISO8601().withMessage('Data e hora devem estar em formato ISO 8601'),
    body('status').isIn(['agendado', 'cancelado', 'concluído']).withMessage('Status deve ser "agendado", "cancelado" ou "concluído"')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { cliente_id, servico_id, prestador_id, data_hora, status } = req.body;
    const query = 'INSERT INTO Appointments (cliente_id, servico_id, prestador_id, data_hora, status) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [cliente_id, servico_id, prestador_id, data_hora, status], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Erro ao agendar serviço", error: err });
        }
        res.status(201).send({ message: "Serviço agendado com sucesso", appointmentId: result.insertId });
    });
});

module.exports = router;



// Listar todos os compromissos
router.get('/', (req, res) => {
    db.query('SELECT * FROM Appointments', (err, results) => {
        if (err) {
            return res.status(500).send({ message: "Erro ao buscar compromissos", error: err });
        }
        res.status(200).json(results);
    });
});

// Atualizar um compromisso
router.put('/:id', [
    body('status').isIn(['agendado', 'cancelado', 'concluído']).withMessage('Status deve ser "agendado", "cancelado" ou "concluído"')
], (req, res) => {
    console.log(req.body);
    console.log(res.body);
    const { status } = req.body;
    const query = 'UPDATE Appointments SET status = ? WHERE id = ?';
    db.query(query, [status, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Erro ao atualizar compromisso", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Compromisso não encontrado" });
        }
        res.status(200).send({ message: "Compromisso atualizado com sucesso" });
    });
});

// Deletar um compromisso
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM Appointments WHERE id = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Erro ao deletar compromisso", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Compromisso não encontrado" });
        }
        res.status(200).send({ message: "Compromisso deletado com sucesso" });
    });
});

module.exports = router;

