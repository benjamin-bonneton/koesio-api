const request = require('supertest');
const app = require('../index');
const db = require('../packages/db');

describe('Auteurs', () => {
    beforeAll(async () => {
        await db.query('DELETE FROM auteurs');
        await db.query('ALTER TABLE auteurs AUTO_INCREMENT = 1');
    });

    afterAll(async () => {
        await db.query('DELETE FROM auteurs');
        await db.query('ALTER TABLE auteurs AUTO_INCREMENT = 1');
        await db.end();
    });

    // Ajouter un auteur
    it("Retourne 400 si le nom est manquant", async () => {
        const response = await request(app)
            .post('/api/v1/auteurs')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({prenom: 'Benjamin'});
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'nom' est requis !");
    });

    it("Retourne 400 si le prénom est manquant", async () => {
        const response = await request(app)
            .post('/api/v1/auteurs')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({nom: 'Bonneton'});
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'prenom' est requis !");
    });

    it("Retourne 201 si l'auteur est ajouté", async () => {
        const response = await request(app)
            .post('/api/v1/auteurs')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                nom: 'Bonneton',
                prenom: 'Benjamin'
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Auteur ajouté avec succès !");
    });

    // Lecture d'un auteur
    it("Retourne 400 si l'id n'est pas un nombre", async () => {
        const response = await request(app)
            .get('/api/v1/auteurs/test')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id' doit être un nombre !");
    });

    it("Retourne 404 si l'id n'existe pas", async () => {
        const response = await request(app)
            .get('/api/v1/auteurs/2')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("L'auteur avec l'id '2' n'existe pas !");
    });

    it("Retourne 200 si l'auteur existe", async () => {
        const response = await request(app)
            .get('/api/v1/auteurs/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(200);
    });

    // Lecture de tous les auteurs
    it("Retourne 200 si les auteurs sont listés", async () => {
        const response = await request(app)
            .get('/api/v1/auteurs')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(200);
    });

    // Mettre à jour un auteur
    it("Retourne 400 si l'id n'est pas un nombre", async () => {
        const response = await request(app)
            .put('/api/v1/auteurs/test')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id' doit être un nombre !");
    });

    it("Retourne 404 si l'id n'existe pas", async () => {
        const response = await request(app)
            .put('/api/v1/auteurs/2')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send(
                {
                    nom: 'Bonneton',
                    prenom: 'Benjamin'
                }
            );
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("L'auteur avec l'id '2' n'existe pas !");
    });

    it("Retourne 400 si le nom n'est pas défini", async () => {
        const response = await request(app)
            .put('/api/v1/auteurs/2')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send(
                {
                    prenom: 'Benjamin'
                }
            );
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'nom' est requis !");
    });

    it("Retourne 400 si le prénom n'est pas défini", async () => {
        const response = await request(app)
            .put('/api/v1/auteurs/2')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send(
                {
                    nom: 'Bonneton'
                }
            );
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'prenom' est requis !");
    });

    it("Retourne 200 si l'auteur est mis à jour", async () => {
        const response = await request(app)
            .put('/api/v1/auteurs/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send(
                {
                    nom: 'Bonneton',
                    prenom: 'Benjamin'
                }
            );
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Auteur mis à jour avec succès !");
    });

    // Supprimer un auteur
    it("Retourne 400 si l'id n'est pas un nombre", async () => {
        const response = await request(app)
            .delete('/api/v1/auteurs/test')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id' doit être un nombre !");
    });

    it("Retourne 404 si l'id n'existe pas", async () => {
        const response = await request(app)
            .delete('/api/v1/auteurs/2')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("L'auteur avec l'id '2' n'existe pas !");
    });

    it("Retourne 200 si l'auteur est supprimé", async () => {
        const response = await request(app)
            .delete('/api/v1/auteurs/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Auteur supprimé avec succès !");
    });
});