const express = require('express');
const router = express.Router();

const db = require('../packages/db');

// Création d'un emprunt
router.post('/emprunts', async (req, res) => {
    // Récupérer les données
    const {id_livre} = req.body;
    const {id_utilisateur} = req.body;

    // Vérifier si les champs sont vides
    if (!id_livre) {
        return res.status(400).json({message: "L'argument 'id_livre' est requis !"});
    } else if (!id_utilisateur) {
        return res.status(400).json({message: "L'argument 'id_utilisateur' est requis !"});
    }

    // Vérifier l'état des données
    if (isNaN(id_livre)) {
        return res.status(400).json({message: "L'argument 'id_livre' doit être un nombre !"});
    } else if (isNaN(id_utilisateur)) {
        return res.status(400).json({message: "L'argument 'id_utilisateur' doit être un nombre !"});
    }

    // Vérifier si le livre existe
    try {
        const [livre] = await db.query('SELECT * FROM livres WHERE id_livre = ?', [id_livre]);

        if (livre.length === 0) {
            return res.status(404).json({message: `Le livre avec l'id '${id_livre}' n'existe pas !`});
        }
    } catch (err) {
        return res.status(500).json({error: err.message});
    }

    // Vérifier si l'utilisateur existe
    try {
        const [utilisateur] = await db.query('SELECT * FROM utilisateurs WHERE id_utilisateur = ?', [id_utilisateur]);

        if (utilisateur.length === 0) {
            return res.status(404).json({message: `L'utilisateur avec l'id '${id_utilisateur}' n'existe pas !`});
        }
    } catch (err) {
        return res.status(500).json({error: err.message});
    }

    // Vérifier si le livre est déjà emprunté
    try {
        const [emprunt] = await db.query('SELECT * FROM emprunts WHERE id_livre = ? AND date_retour IS NULL', [id_livre]);

        if (emprunt.length > 0) {
            return res.status(400).json({message: "Le livre est déjà emprunté !"});
        }
    } catch (err) {
        return res.status(500).json({error: err.message});
    }

    // Créer l'emprunt
    try {
        await db.query('INSERT INTO emprunts (id_livre, id_utilisateur, date_emprunt) VALUES (?, ?, ?)', [id_livre, id_utilisateur, new Date()]);
        return res.status(201).json({message: "Emprunt créé avec succès !"});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Retour d'un emprunt
router.put('/emprunts/:id', async (req, res) => {
    // Récupérer l'id
    const {id} = req.params;

    // Vérifier si l'id est présent
    if (!id) {
        return res.status(400).json({message: "L'argument 'id' est requis !"});
    }

    // Vérifier si l'id est un nombre
    if (isNaN(id)) {
        return res.status(400).json({message: "L'argument 'id' doit être un nombre !"});
    }

    // Vérifier si l'emprunt existe
    try {
        const [emprunt] = await db.query('SELECT * FROM emprunts WHERE id_emprunt = ?', [id]);

        if (emprunt.length === 0) {
            return res.status(404).json({message: `L'emprunt avec l'id '${id}' n'existe pas !`});
        }
    } catch (err) {
        return res.status(500).json({error: err.message});
    }

    // Vérifier si le livre est déjà retourné
    try {
        const [emprunt] = await db.query('SELECT * FROM emprunts WHERE id_emprunt = ? AND date_retour IS NOT NULL', [id]);

        if (emprunt.length > 0) {
            return res.status(400).json({message: "Le livre est déjà retourné !"});
        }
    } catch (err) {
        return res.status(500).json({error: err.message});
    }

    // Retourner le livre
    try {
        await db.query('UPDATE emprunts SET date_retour = ? WHERE id_emprunt = ?', [new Date(), id]);
        return res.status(200).json({message: "Livre retourné avec succès !"});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Recherche des emprunts par utilisateur, par livre ou par emprunt en cours
router.get('/emprunts', async (req, res) => {
    // Récupérer les paramètres
    const {id_utilisateur} = req.query;
    const {id_livre} = req.query;
    const {en_cours} = req.query;

    // Créer la requête
    let query = 'SELECT * FROM emprunts';
    let params = [];

    // Vérifier le livre
    if (id_livre) {
        if (params.length === 0) {
            query += ' WHERE';
        } else {
            query += ' AND';
        }
        query += ' id_livre = ?';
        params.push(id_livre);
    }

    // Vérifier l'utilisateur
    if (id_utilisateur) {
        if (params.length === 0) {
            query += ' WHERE';
        } else {
            query += ' AND';
        }
        query += ' id_utilisateur = ?';
        params.push(id_utilisateur);
    }

    // Vérifier si l'emprunt est en cours
    if (en_cours) {
        if (params.length === 0) {
            query += ' WHERE';
        } else {
            query += ' AND';
        }

        if (en_cours === 'true') {
            query += ' date_retour IS NULL';
        } else {
            query += ' date_retour IS NOT NULL';
        }
    }

    // Exécuter la requête
    try {
        const [rows] = await db.query(query, params);

        if (rows.length === 0) {
            return res.status(404).json({message: "Aucun emprunt trouvé !"});
        }
        
        return res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;
