const request = require('supertest');
const app = require('../index');
const db = require('../packages/db');

describe('Livres', () => {
    beforeAll(async () => {
        await db.query('DELETE FROM livres');
        await db.query('ALTER TABLE livres AUTO_INCREMENT = 1');

        await db.query('DELETE FROM auteurs');
        await db.query('ALTER TABLE auteurs AUTO_INCREMENT = 1');
        await db.query('INSERT INTO auteurs (nom, prenom) VALUES (?, ?)', ["Benjamin", "Bonneton"]);
    });

    afterAll(async () => {
        await db.query('DELETE FROM auteurs');
        await db.query('ALTER TABLE auteurs AUTO_INCREMENT = 1');

        await db.query('DELETE FROM livres');
        await db.query('ALTER TABLE livres AUTO_INCREMENT = 1');
        await db.end();
    });

    // Ajouter un livre
    it("Retourne 400 si le titre est manquant", async () => {
        const response = await request(app)
            .post('/livres')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                id_genre: 1,
                id_auteur: 1
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'titre' est requis !");
    });
    
    it("Retourne 400 si l'id_genre est manquant", async () => {
        const response = await request(app)
            .post('/livres')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: "Titre",
                id_auteur: 1
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id_genre' est requis !");
    });

    it("Retourne 400 si l'id_auteur est manquant", async () => {
        const response = await request(app)
            .post('/livres')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: "Titre",
                id_genre: 1
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id_auteur' est requis !");
    });

    it("Retourne 400 si le titre n'est pas une chaîne de caractères", async () => {
        const response = await request(app)
            .post('/livres')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: 1,
                id_genre: 1,
                id_auteur: 1
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'titre' doit être une chaîne de caractères !");
    });

    it("Retourne 400 si l'id_genre n'est pas un nombre", async () => {
        const response = await request(app)
            .post('/livres')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: "Titre",
                id_genre: "Genre",
                id_auteur: 1
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id_genre' doit être un nombre !");
    });

    it("Retourne 400 si l'id_auteur n'est pas un nombre", async () => {
        const response = await request(app)
            .post('/livres')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: "Titre",
                id_genre: 1,
                id_auteur: "Auteur"
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id_auteur' doit être un nombre !");
    });

    it("Retourne 404 si le genre n'existe pas", async () => {
        const response = await request(app)
            .post('/livres')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: "Titre",
                id_genre: 1000,
                id_auteur: 1
            });
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Le genre avec l'id '1000' n'existe pas !");
    });

    it("Retourne 404 si l'auteur n'existe pas", async () => {
        const response = await request(app)
            .post('/livres')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: "Titre",
                id_genre: 1,
                id_auteur: 1000
            });
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("L'auteur avec l'id '1000' n'existe pas !");
    });

    it("Retourne 200 si le livre est ajouté", async () => {
        const response = await request(app)
            .post('/livres')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: "Titre",
                id_genre: 1,
                id_auteur: 1
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Livre ajouté avec succès !");
    });

    // Lecture d'un livre
    it("Retourne 400 si l'id n'est pas un nombre", async () => {
        const response = await request(app)
            .get('/livres/test')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'identifiant doit être un nombre !");
    });

    it("Retourne 404 si l'id n'existe pas", async () => {
        const response = await request(app)
            .get('/livres/2')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Livre avec l'id '2' non trouvé !");
    });

    it("Retourne 200 si le livre existe", async () => {
        const response = await request(app)
            .get('/livres/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(200);
    });

    // Mettre à jour un livre
    it("Retourne 400 si l'id n'est pas un nombre", async () => {
        const response = await request(app)
            .put('/livres/test')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'identifiant doit être un nombre !");
    });

    it("Retourne 404 si l'id n'existe pas", async () => {
        const response = await request(app)
            .put('/livres/2')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Livre avec l'id '2' non trouvé !");
    });

    it("Retourne 400 si le titre est manquant", async () => {
        const response = await request(app)
            .put('/livres/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                id_genre: 1,
                id_auteur: 1
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'titre' est requis !");
    });

    it("Retourne 400 si l'id_genre est manquant", async () => {
        const response = await request(app)
            .put('/livres/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: "Titre",
                id_auteur: 1
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id_genre' est requis !");
    });

    it("Retourne 400 si l'id_auteur est manquant", async () => {
        const response = await request(app)
            .put('/livres/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: "Titre",
                id_genre: 1
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id_auteur' est requis !");
    });

    it("Retourne 400 si le titre n'est pas une chaîne de caractères", async () => {
        const response = await request(app)
            .put('/livres/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: 1,
                id_genre: 1,
                id_auteur: 1
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'titre' doit être une chaîne de caractères !");
    });

    it("Retourne 400 si l'id_genre n'est pas un nombre", async () => {
        const response = await request(app)
            .put('/livres/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: "Titre",
                id_genre: "Genre",
                id_auteur: 1
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id_genre' doit être un nombre !");
    });

    it("Retourne 400 si l'id_auteur n'est pas un nombre", async () => {
        const response = await request(app)
            .put('/livres/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: "Titre",
                id_genre: 1,
                id_auteur: "Auteur"
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id_auteur' doit être un nombre !");
    });

    it("Retourne 404 si le genre n'existe pas", async () => {
        const response = await request(app)
            .put('/livres/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: "Titre",
                id_genre: 1000,
                id_auteur: 1
            });
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Le genre avec l'id '1000' n'existe pas !");
    });

    it("Retourne 404 si l'auteur n'existe pas", async () => {
        const response = await request(app)
            .put('/livres/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: "Titre",
                id_genre: 1,
                id_auteur: 1000
            });
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("L'auteur avec l'id '1000' n'existe pas !");
    });

    it("Retourne 200 si le livre est mis à jour", async () => {
        const response = await request(app)
            .put('/livres/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                titre: "Titre",
                id_genre: 1,
                id_auteur: 1
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Livre mis à jour avec succès !");
    });

    // Obtenir les livres avec les paramètres spécifiés
    it("Retourne 200 si les livres sont obtenus", async () => {
        const response = await request(app)
            .get('/livres?id_auteur=1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(200);
    });

    // Supprimer un livre
    it("Retourne 400 si l'id n'est pas un nombre", async () => {
        const response = await request(app)
            .delete('/livres/test')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'identifiant doit être un nombre !");
    });

    it("Retourne 404 si l'id n'existe pas", async () => {
        const response = await request(app)
            .delete('/livres/2')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Livre avec l'id '2' non trouvé !");
    });

    it("Retourne 200 si le livre est supprimé", async () => {
        const response = await request(app)
            .delete('/livres/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Livre supprimé avec succès !");
    });
});