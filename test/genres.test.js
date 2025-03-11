const request = require('supertest');
const app = require('../index');
const db = require('../packages/db');

describe('Genres', () => {
    // Lister tous les genres
    it("Retourne 200 si les genres sont listés", async () => {
        const response = await request(app)
            .get('/genres')
            .set('username', process.env.API_USERNAME)
            .set('key_pass', process.env.API_KEY)
            .send();
        expect(response.statusCode).toBe(200);
    });
});