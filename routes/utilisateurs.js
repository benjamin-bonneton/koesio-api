const express = require('express');
const router = express.Router();

const db = require('../packages/db');

// Ajouter un utilisateur
router.post('/utilisateurs', async (req, res) => {
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
        await db.query('INSERT INTO utilisateurs (nom, prenom) VALUES (?, ?)', [nom, prenom]);
        return res.status(201).json({message: "Utilisateur ajouté avec succès !"});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Lecture d'un utilisateur
router.get('/utilisateurs/:id', async (req, res) => {
    // Récupérer l'id
    const {id} = req.params;

    // Vérifier si l'id est un nombre
    if (isNaN(id)) {
        return res.status(400).json({message: "L'argument 'id' doit être un nombre !"});
    }

    // Récupérer l'utilisateur
    try {
        const [utilisateurs] = await db.query('SELECT * FROM utilisateurs WHERE id_utilisateur = ?', [id]);

        if (utilisateurs.length === 0) {
            return res.status(404).json({message: `L'utilisateur avec l'id '${id}' n'existe pas !`});
        }

        return res.status(200).json(utilisateurs[0]);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Lecture de tous les utilisateurs
router.get('/utilisateurs', async (req, res) => {
    // Récupérer les utilisateurs
    try {
        const [utilisateurs] = await db.query('SELECT * FROM utilisateurs');

        if (utilisateurs.length === 0) {
            return res.status(404).json({message: "Aucun utilisateur trouvé !"});
        }

        return res.status(200).json(utilisateurs);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Mettre à jour un utilisateur
router.put('/utilisateurs/:id', async (req, res) => {
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

    // Mettre à jour l'utilisateur
    try {
        const [utilisateur] = await db.query('SELECT * FROM auteurs WHERE id_auteur = ?', [id]);

        if (utilisateur.length === 0) {
            return res.status(404).json({message: `L'utilisateur avec l'id '${id}' n'existe pas !`});
        }

        await db.query('UPDATE utilisateurs SET nom = ?, prenom = ? WHERE id_utilisateur = ?', [nom, prenom, id]);
        return res.status(200).json({message: "Utilisateur mis à jour avec succès !"});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Supprimer un utilisateur
router.delete('/utilisateurs/:id', async (req, res) => {
    // Récupérer l'id
    const {id} = req.params;

    // Vérifier si l'id est un nombre
    if (isNaN(id)) {
        return res.status(400).json({message: "L'argument 'id' doit être un nombre !"});
    }

    // Supprimer l'auteur
    try {
        const [utilisateur] = await db.query('SELECT * FROM utilisateurs WHERE id_utilisateur = ?', [id]);

        if (utilisateur.length === 0) {
            return res.status(404).json({message: `L'utilisateur avec l'id '${id}' n'existe pas !`});
        }

        await db.query('DELETE FROM utilisateurs WHERE id_utilisateur = ?', [id]);
        await db.query('UPDATE emprunts SET id_utilisateur = NULL WHERE id_utilisateur = ?', [id]);
        return res.status(200).json({message: "Utilisateur supprimé avec succès !"});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;