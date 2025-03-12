const express = require('express');
const router = express.Router();

const db = require('../packages/db');

// Tentaive de connexion
router.post('/login', async (req, res) => {
    // Récupérer les données
    const {username} = req.body;
    const {key_pass} = req.body;

    // Vérifier si les champs sont vides
    if (!username) {
        return res.status(400).json({message: "L'argument 'username' est requis !"});
    } else if (!key_pass) {
        return res.status(400).json({message: "L'argument 'key_pass' est requis !"});
    }

    // Vérifier si l'utilisateur est correct
    try {
        const [utilisateur] = await db.query('SELECT * FROM api_keys WHERE username = ? AND key_pass = ?', [username, key_pass]);

        if (utilisateur.length === 0) {
            return res.status(401).json({message: "Username ou key_pass incorrect"});
        }

        return res.status(200).json(utilisateur[0]);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;