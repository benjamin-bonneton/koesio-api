const db = require('./db');

// Authentification
const authentification = async (req, res, next) => {
    const { username, key_pass } = req.headers;

    // Vérifier si les champs sont vides
    if (!username) {
        return res.status(401).json({ message: 'Username manquant' });
    } else if (!key_pass) {
        return res.status(401).json({ message: 'Key_pass manquant' });
    }

    // Vérifier si les champs sont corrects
    try {
        const [results] = await db.query('SELECT * FROM api_keys WHERE username = ? AND key_pass = ?', [username, key_pass]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'Username ou Key_pass incorrect' });
        }

        // Informations correctes
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Erreur interne' });
    }
};

module.exports = authentification;