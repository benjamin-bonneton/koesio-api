const express = require('express');
const router = express.Router();

const db = require('../packages/db');

// Ajouter un auteur
router.post('/auteurs', async (req, res) => {
    // Récupérer les données
    const {nom} = req.body;
    const {prenom} = req.body;

    // Vérifier si les champs sont vides
    if (!nom) {
        return res.status(400).json({message: "L'argument 'nom' est requis !"});
    } else if (!prenom) {
        return res.status(400).json({message: "L'argument 'prenom' est requis !"});
    }

    // Vérifier l'état des données
    if (typeof nom !== 'string') {
        return res.status(400).json({message: "L'argument 'nom' doit être une chaîne de caractères !"});
    } else if (typeof prenom !== 'string') {
        return res.status(400).json({message: "L'argument 'prenom' doit être une chaîne de caractères !"});
    }

    // Ajouter à la base de données
    try {
        await db.query('INSERT INTO auteurs (nom, prenom) VALUES (?, ?)', [nom, prenom]);
        return res.status(201).json({message: "Auteur ajouté avec succès !"});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Lecture d'un auteur
router.get('/auteurs/:id', async (req, res) => {
    // Récupérer l'id
    const {id} = req.params;

    // Vérifier si l'id est un nombre
    if (isNaN(id)) {
        return res.status(400).json({message: "L'argument 'id' doit être un nombre !"});
    }

    // Récupérer l'auteur
    try {
        const [auteur] = await db.query('SELECT * FROM auteurs WHERE id_auteur = ?', [id]);

        if (auteur.length === 0) {
            return res.status(404).json({message: `L'auteur avec l'id '${id}' n'existe pas !`});
        }

        return res.status(200).json(auteur[0]);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Lecture de tous les auteurs
router.get('/auteurs', async (req, res) => {
    // Récupérer les auteurs
    try {
        const [auteurs] = await db.query('SELECT * FROM auteurs');

        if (auteurs.length === 0) {
            return res.status(404).json({message: "Aucun auteur trouvé !"});
        }

        return res.status(200).json(auteurs);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Mettre à jour un auteur
router.put('/auteurs/:id', async (req, res) => {
    // Récupérer l'id
    const {id} = req.params;

    // Récupérer les données
    const {nom} = req.body;
    const {prenom} = req.body;

    // Vérifier si l'id est un nombre
    if (isNaN(id)) {
        return res.status(400).json({message: "L'argument 'id' doit être un nombre !"});
    }

    // Vérifier si les champs sont vides
    if (!nom) {
        return res.status(400).json({message: "L'argument 'nom' est requis !"});
    } else if (!prenom) {
        return res.status(400).json({message: "L'argument 'prenom' est requis !"});
    }

    // Vérifier l'état des données
    if (typeof nom !== 'string') {
        return res.status(400).json({message: "L'argument 'nom' doit être une chaîne de caractères !"});
    } else if (typeof prenom !== 'string') {
        return res.status(400).json({message: "L'argument 'prenom' doit être une chaîne de caractères !"});
    }

    // Mettre à jour l'auteur
    try {
        const [auteur] = await db.query('SELECT * FROM auteurs WHERE id_auteur = ?', [id]);

        if (auteur.length === 0) {
            return res.status(404).json({message: `L'auteur avec l'id '${id}' n'existe pas !`});
        }

        await db.query('UPDATE auteurs SET nom = ?, prenom = ? WHERE id_auteur = ?', [nom, prenom, id]);
        return res.status(200).json({message: "Auteur mis à jour avec succès !"});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Supprimer un auteur
router.delete('/auteurs/:id', async (req, res) => {
    // Récupérer l'id
    const {id} = req.params;

    // Vérifier si l'id est un nombre
    if (isNaN(id)) {
        return res.status(400).json({message: "L'argument 'id' doit être un nombre !"});
    }

    // Supprimer l'auteur
    try {
        const [auteur] = await db.query('SELECT * FROM auteurs WHERE id_auteur = ?', [id]);

        if (auteur.length === 0) {
            return res.status(404).json({message: `L'auteur avec l'id '${id}' n'existe pas !`});
        }

        await db.query('DELETE FROM auteurs WHERE id_auteur = ?', [id]);
        return res.status(200).json({message: "Auteur supprimé avec succès !"});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;
