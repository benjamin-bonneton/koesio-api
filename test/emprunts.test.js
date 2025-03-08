const request = require('supertest');
const app = require('../index');
const db = require('../packages/db');

describe('Emprunts', () => {
    beforeAll(async () => {
        await db.query('DELETE FROM emprunts');
        await db.query('ALTER TABLE emprunts AUTO_INCREMENT = 1');

        await db.query('DELETE FROM auteurs');
        await db.query('ALTER TABLE auteurs AUTO_INCREMENT = 1');
        await db.query('INSERT INTO auteurs (nom, prenom) VALUES (?, ?)', ["Benjamin", "Bonneton"]);

        await db.query('DELETE FROM livres');
        await db.query('ALTER TABLE livres AUTO_INCREMENT = 1');
        await db.query('INSERT INTO livres (titre, id_genre, id_auteur) VALUES (?, ?, ?)', ["Le test", 1, 1]);

        await db.query('DELETE FROM utilisateurs');
        await db.query('ALTER TABLE utilisateurs AUTO_INCREMENT = 1');
        await db.query('INSERT INTO utilisateurs (nom, prenom) VALUES (?, ?)', ["Benji", "Bonneton"]);
    });

    afterAll(async () => {
        await db.query('DELETE FROM auteurs');
        await db.query('ALTER TABLE auteurs AUTO_INCREMENT = 1');

        await db.query('DELETE FROM livres');
        await db.query('ALTER TABLE livres AUTO_INCREMENT = 1');

        await db.query('DELETE FROM utilisateurs');
        await db.query('ALTER TABLE utilisateurs AUTO_INCREMENT = 1');

        await db.query('DELETE FROM emprunts');
        await db.query('ALTER TABLE emprunts AUTO_INCREMENT = 1');
        await db.end();
    });

    // Création d'un emprunt
    it("Retourne 400 si id_livre est manquant", async () => {
        const response = await request(app)
            .post('/emprunts')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                id_utilisateur: 1
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id_livre' est requis !");
    });

    it("Retourne 400 si id_utilisateur est manquant", async () => {
        const response = await request(app)
            .post('/emprunts')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                id_livre: 1
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id_utilisateur' est requis !");
    });

    it("Retourne 400 si id_livre n'est pas un nombre", async () => {
        const response = await request(app)
            .post('/emprunts')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                id_livre: "test",
                id_utilisateur: 1
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id_livre' doit être un nombre !");
    });

    it("Retourne 400 si id_utilisateur n'est pas un nombre", async () => {
        const response = await request(app)
            .post('/emprunts')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                id_livre: 1,
                id_utilisateur: "test"
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id_utilisateur' doit être un nombre !");
    });

    it("Retourne 404 si le livre n'existe pas", async () => {
        const response = await request(app)
            .post('/emprunts')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                id_livre: 2,
                id_utilisateur: 1
            });
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Le livre avec l'id '2' n'existe pas !");
    });

    it("Retourne 404 si l'utilisateur n'existe pas", async () => {
        const response = await request(app)
            .post('/emprunts')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                id_livre: 1,
                id_utilisateur: 2
            });
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("L'utilisateur avec l'id '2' n'existe pas !");
    });

    it("Retourne 400 si le livre est déjà emprunté", async () => {
        await db.query('INSERT INTO emprunts (id_livre, id_utilisateur, date_emprunt) VALUES (?, ?, ?)', [1, 1, new Date()]);

        const response = await request(app)
            .post('/emprunts')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                id_livre: 1,
                id_utilisateur: 1
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Le livre est déjà emprunté !");
    });

    it("Retourne 201 si l'emprunt est créé", async () => {
        await db.query('DELETE FROM emprunts');
        await db.query('ALTER TABLE emprunts AUTO_INCREMENT = 1');

        const response = await request(app)
            .post('/emprunts')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                id_livre: 1,
                id_utilisateur: 1
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Emprunt créé avec succès !");
    });

    // Retour d'un emprunt
    it("Retourne 400 si id n'est pas un nombre", async () => {
        const response = await request(app)
            .put('/emprunts/test')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id' doit être un nombre !");
    });

    it("Retourne 404 si l'emprunt n'existe pas", async () => {
        const response = await request(app)
            .put('/emprunts/2')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("L'emprunt avec l'id '2' n'existe pas !");
    });

    it("Retourne 200 si l'emprunt est retourné", async () => {
        const response = await request(app)
            .put('/emprunts/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Livre retourné avec succès !");

    });

    it("Retourne 400 si l'emprunt est déjà retourné", async () => {
        const response = await request(app)
            .put('/emprunts/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Le livre est déjà retourné !");
    });

    // Recherche des emprunts
    it("Retourne 200 si l'emprunt existe", async () => {
        const response = await request(app)
            .get('/emprunts')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY);
        expect(response.statusCode).toBe(200);
    });
});