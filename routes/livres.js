const express = require('express');
const router = express.Router();

const db = require('../packages/db');

// Ajouter un livre
router.post('/livres', async (req, res) => {
    // Récupérer les données
    const {isbn} = req.body;
    const {titre} = req.body;
    const {id_genre} = req.body;
    const {id_auteur} = req.body;

    // Vérifier si les champs sont vides
    if (!titre) {
        return res.status(400).json({message: "L'argument 'titre' est requis !"});
    } else if (!id_genre) {
        return res.status(400).json({message: "L'argument 'id_genre' est requis !"});
    } else if (!id_auteur) {
        return res.status(400).json({message: "L'argument 'id_auteur' est requis !"});
    } else if (!isbn) {
        return res.status(400).json({message: "L'argument 'isbn' est requis !"});
    }

    // Vérifier l'état des données
    if (typeof titre !== 'string') {
        return res.status(400).json({message: "L'argument 'titre' doit être une chaîne de caractères !"});
    } else if (isNaN(id_genre)) {
        return res.status(400).json({message: "L'argument 'id_genre' doit être un nombre !"});
    } else if (isNaN(id_auteur)) {
        return res.status(400).json({message: "L'argument 'id_auteur' doit être un nombre !"});
    } else if (typeof isbn !== 'string') {
        return res.status(400).json({message: "L'argument 'isbn' doit être une chaîne de caractères !"});
    }

    // Vérifier si le genre existe
    try {
        const [genre] = await db.query('SELECT * FROM genres WHERE id_genre = ?', [id_genre]);

        if (genre.length === 0) {
            return res.status(404).json({message: `Le genre avec l'id '${id_genre}' n'existe pas !`});
        }
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
    
    // Vérifier si l'auteur existe
    try {
        const [auteur] = await db.query('SELECT * FROM auteurs WHERE id_auteur = ?', [id_auteur]);

        if (auteur.length === 0) {
            return res.status(404).json({message: `L'auteur avec l'id '${id_auteur}' n'existe pas !`});
        }
    } catch (err) {
        return res.status(500).json({error: err.message});
    }

    // Vérifier si le livre existe déjà
    try {
        const [rows] = await db.query('SELECT * FROM livres WHERE isbn = ?', [isbn]);

        if (rows.length > 0) {
            return res.status(409).json({message: `Le livre avec l'ISBN '${isbn}' existe déjà !`});
        }
    } catch (err) {
        return res.status(500).json({error: err.message});
    }

    // Ajouter à la base de données
    try {
        await db.query('INSERT INTO livres (isbn, titre, id_genre, id_auteur) VALUES (?, ?, ?, ?)', [isbn, titre, id_genre, id_auteur]);
        return res.status(201).json({message: "Livre ajouté avec succès !"});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Lecture d'un livre
router.get('/livres/:id', async (req, res) => {
    // Récupérer l'identifiant
    const {id} = req.params;

    // Vérifier si l'identifiant est un nombre
    if (isNaN(id)) {
        return res.status(400).json({message: "L'identifiant doit être un nombre !"});
    }

    try {
        // Vérifier si le livre existe
        const [rows] = await db.query('SELECT\
            livres.isbn as livre_isbn, livres.titre as livre_titre,\
            genres.nom as genre_nom,\
            auteurs.nom as auteur_nom, auteurs.prenom as auteur_prenom\
            FROM livres\
            INNER JOIN genres ON livres.id_genre = genres.id_genre\
            INNER JOIN auteurs ON livres.id_auteur = auteurs.id_auteur\
            WHERE id_livre = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({message: `Livre avec l'id '${id}' non trouvé !`});
        }

        // Récupérer les informations
        return res.status(200).json(rows[0]);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Mettre à jour un livre
router.put('/livres/:id', async (req, res) => {
    // Récupérer les données
    const {id} = req.params;
    const {isbn} = req.body;
    const {titre} = req.body;
    const {id_genre} = req.body;
    const {id_auteur} = req.body;

    // Vérifier si l'identifiant est un nombre
    if (isNaN(id)) {
        return res.status(400).json({message: "L'identifiant doit être un nombre !"});
    }

    // Vérifier si le livre existe
    try {
        const [rows] = await db.query('SELECT * FROM livres WHERE id_livre = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({message: `Livre avec l'id '${id}' non trouvé !`});
        }
    } catch (err) {
        return res.status(500).json({error: err.message});
    }

    // Vérifier si les champs sont vides
    if (!titre) {
        return res.status(400).json({message: "L'argument 'titre' est requis !"});
    } else if (!id_genre) {
        return res.status(400).json({message: "L'argument 'id_genre' est requis !"});
    } else if (!id_auteur) {
        return res.status(400).json({message: "L'argument 'id_auteur' est requis !"});
    }  else if (!isbn) {
        return res.status(400).json({message: "L'argument 'isbn' est requis !"});
    }

    // Vérifier l'état des données
    if (typeof titre !== 'string') {
        return res.status(400).json({message: "L'argument 'titre' doit être une chaîne de caractères !"});
    } else if (isNaN(id_genre)) {
        return res.status(400).json({message: "L'argument 'id_genre' doit être un nombre !"});
    } else if (isNaN(id_auteur)) {
        return res.status(400).json({message: "L'argument 'id_auteur' doit être un nombre !"});
    } else if (typeof isbn !== 'string') {
        return res.status(400).json({message: "L'argument 'isbn' doit être une chaîne de caractères !"});
    }

    // Vérifier si le genre existe
    try {
        const [genre] = await db.query('SELECT * FROM genres WHERE id_genre = ?', [id_genre]);

        if (genre.length === 0) {
            return res.status(404).json({message: `Le genre avec l'id '${id_genre}' n'existe pas !`});
        }
    } catch (err) {
        return res.status(500).json({error: err.message});
    }

    // Vérifier si l'auteur existe
    try {
        const [auteur] = await db.query('SELECT * FROM auteurs WHERE id_auteur = ?', [id_auteur]);

        if (auteur.length === 0) {
            return res.status(404).json({message: `L'auteur avec l'id '${id_auteur}' n'existe pas !`});
        }
    } catch (err) {
        return res.status(500).json({error: err.message});
    }

    // Vérifier si l'isbn existe déjà et que ce n'est pas le même
    try {
        const [rows] = await db.query('SELECT * FROM livres WHERE isbn = ? AND id_livre != ?', [isbn, id]);

        if (rows.length > 0) {
            return res.status(409).json({message: `Le livre avec l'ISBN '${isbn}' existe déjà !`});
        }
    } catch (err) {
        return res.status(500).json({error: err.message});
    }

    // Mettre à jour le livre
    try {
        await db.query('UPDATE livres SET isbn = ?, titre = ?, id_genre = ?, id_auteur = ? WHERE id_livre = ?', [isbn, titre, id_genre, id_auteur, id]);
        return res.status(200).json({message: "Livre mis à jour avec succès !"});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Supprimer un livre
router.delete('/livres/:id', async (req, res) => {
    // Récupérer l'identifiant
    const {id} = req.params;

    // Vérifier si l'identifiant est un nombre
    if (isNaN(id)) {
        return res.status(400).json({message: "L'identifiant doit être un nombre !"});
    }

    // Vérifier si le livre existe
    try {
        const [rows] = await db.query('SELECT * FROM livres WHERE id_livre = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({message: `Livre avec l'id '${id}' non trouvé !`});
        }
    } catch (err) {
        return res.status(500).json({error: err.message});
    }

    // Supprimer le livre
    try {
        await db.query('DELETE FROM livres WHERE id_livre = ?', [id]);
        await db.query('DELETE FROM emprunts WHERE id_livre = ?', [id]);
        return res.status(200).json({message: "Livre supprimé avec succès !"});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Recherche des livres par auteur, par genre, par ISBN, par titre ou par disponibilité
router.get('/livres', async (req, res) => {
    // Récupérer les paramètres
    const {isbn} = req.query;
    const {titre} = req.query;
    const {id_auteur} = req.query;
    const {id_genre} = req.query;
    const {disponible} = req.query;

    // Créer la requête
    let query = 'SELECT\
    livres.id_livre, livres.isbn, livres.titre,\
    genres.nom as genre_nom,\
    auteurs.nom as auteur_nom, auteurs.prenom as auteur_prenom\
    FROM livres\
    INNER JOIN genres ON livres.id_genre = genres.id_genre\
    INNER JOIN auteurs ON livres.id_auteur = auteurs.id_auteur';
    let params = [];

    // Vérifier l'ISBN
    if (isbn && typeof isbn === 'string') {
        query += ' WHERE livres.isbn = ?';
        params.push(isbn);
    }

    // Vérifier le titre
    if (titre && typeof titre === 'string') {
        if (params.length === 0) {
            query += ' WHERE';
        } else {
            query += ' AND';
        }
        query += ' livres.titre LIKE ?';
        params.push(`%${titre}%`);
    }

    // Vérifier l'auteur
    if (id_auteur && typeof id_auteur === 'string') {
        const auteurs = id_auteur.split(',');

        if (auteurs.length > 0 && auteurs.every(id => /^\d+$/.test(id))) {
            if (params.length === 0) {
                query += ' WHERE';
            } else {
                query += ' AND';
            }
            query += ' livres.id_auteur IN (' + '?'.repeat(auteurs.length).split('').join(',') + ')';
            params.push(...auteurs);
        }
    }

    // Vérifier le genre
    if (id_genre && typeof id_genre === 'string') {
        const genres = id_genre.split(',');

        if (genres.length > 0 && genres.every(id => /^\d+$/.test(id))) {
            if (params.length === 0) {
                query += ' WHERE';
            } else {
                query += ' AND';
            }
            query += ' livres.id_genre IN (' + '?'.repeat(genres.length).split('').join(',') + ')';
            params.push(...genres);
        }
    }

    // Vérifier la disponibilité
    if (disponible && disponible === 'true') {
        if (params.length === 0) {
            query += ' WHERE';
        } else {
            query += ' AND';
        }
        query += ' livres.id_livre NOT IN (SELECT id_livre FROM emprunts WHERE date_retour IS NULL)';
    }

    // Exécuter la requête
    try {
        const [rows] = await db.query(query, params);

        if (rows.length === 0) {
            return res.status(404).json({message: "Aucun livre trouvé !"});
        }
        
        return res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;
