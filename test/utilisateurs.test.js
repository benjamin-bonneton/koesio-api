const request = require('supertest');
const app = require('../index');
const db = require('../packages/db');

describe('Utilisateurs', () => {
    beforeAll(async () => {
        await db.query('DELETE FROM utilisateurs');
        await db.query('ALTER TABLE utilisateurs AUTO_INCREMENT = 1');
    });

    afterAll(async () => {
        await db.query('DELETE FROM utilisateurs');
        await db.query('ALTER TABLE utilisateurs AUTO_INCREMENT = 1');
        await db.end();
    });

    // Ajouter un utilisateur
    it("Retourne 400 si le nom est manquant", async () => {
        const response = await request(app)
            .post('/utilisateurs')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({prenom: 'Benjamin'});
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'nom' est requis !");
    });

    it("Retourne 400 si le prénom est manquant", async () => {
        const response = await request(app)
            .post('/utilisateurs')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({nom: 'Bonneton'});
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'prenom' est requis !");
    });

    it("Retourne 201 si l'utilisateur est ajouté", async () => {
        const response = await request(app)
            .post('/utilisateurs')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send({
                nom: 'Bonneton',
                prenom: 'Benjamin'
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Utilisateur ajouté avec succès !");
    });

    // Lecture d'un utilisateur
    it("Retourne 400 si l'id n'est pas un nombre", async () => {
        const response = await request(app)
            .get('/utilisateurs/test')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id' doit être un nombre !");
    });

    it("Retourne 404 si l'id n'existe pas", async () => {
        const response = await request(app)
            .get('/utilisateurs/2')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("L'utilisateur avec l'id '2' n'existe pas !");
    });

    it("Retourne 200 si l'utilisateur existe", async () => {
        const response = await request(app)
            .get('/utilisateurs/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(200);
    });

    // Lecture de tous les utilisateurs
    it("Retourne 200 si les utilisateurs sont listés", async () => {
        const response = await request(app)
            .get('/utilisateurs')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(200);
    });

    // Mettre à jour un utilisateur
    it("Retourne 400 si l'id n'est pas un nombre", async () => {
        const response = await request(app)
            .put('/utilisateurs/test')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id' doit être un nombre !");
    });

    it("Retourne 404 si l'id n'existe pas", async () => {
        const response = await request(app)
            .put('/utilisateurs/2')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send(
                {
                    nom: 'Bonneton',
                    prenom: 'Benjamin'
                }
            );
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("L'utilisateur avec l'id '2' n'existe pas !");
    });

    it("Retourne 400 si le nom n'est pas défini", async () => {
        const response = await request(app)
            .put('/utilisateurs/2')
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
            .put('/utilisateurs/2')
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

    it("Retourne 200 si l'utilisateur est mis à jour", async () => {
        const response = await request(app)
            .put('/utilisateurs/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send(
                {
                    nom: 'Bonneton',
                    prenom: 'Benjamin'
                }
            );
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Utilisateur mis à jour avec succès !");
    });

    // Supprimer un utilisateur
    it("Retourne 400 si l'id n'est pas un nombre", async () => {
        const response = await request(app)
            .delete('/utilisateurs/test')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("L'argument 'id' doit être un nombre !");
    });

    it("Retourne 404 si l'id n'existe pas", async () => {
        const response = await request(app)
            .delete('/utilisateurs/2')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("L'utilisateur avec l'id '2' n'existe pas !");
    });

    it("Retourne 200 si l'utilisateur est supprimé", async () => {
        const response = await request(app)
            .delete('/utilisateurs/1')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Utilisateur supprimé avec succès !");
    });
});