const express = require('express');
const router = express.Router();
const db = require('../config/database'); 

// Listar todos os serviços
router.get('/', (req, res) => {
    const query = 'SELECT * FROM Services';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send({ message: "Erro ao buscar serviços", error: err });
        }
        res.status(200).send(results);
    });
});

module.exports = router;
