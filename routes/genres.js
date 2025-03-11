const express = require('express');
const router = express.Router();

const db = require('../packages/db');

// Obtenir tous les genres
router.get('/genres', async (req, res) => {
    let query = 'SELECT * FROM genres';

    // Exécuter la requête
    try {
        const [rows] = await db.query(query);

        if (rows.length === 0) {
            return res.status(404).json({message: "Aucun genre trouvé !"});
        }
        
        return res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;
