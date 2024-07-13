const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Ajuste o caminho se necessário


// Agendar um novo compromisso
router.post('/', (req, res) => {
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
