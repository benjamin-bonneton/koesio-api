require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 3001;
const VERSION = '1'

const livresRouter = require('./routes/livres');
const auteursRouter = require('./routes/auteurs');
const empruntsRouter = require('./routes/emprunts');
const utilisateursRouter = require('./routes/utilisateurs');
const authentification = require('./packages/authentification');

app.use(express.json())

app.use(`/api/v${VERSION}`, authentification, livresRouter);
app.use(`/api/v${VERSION}`, authentification, auteursRouter);
app.use(`/api/v${VERSION}`, authentification, empruntsRouter);
app.use(`/api/v${VERSION}`, authentification, utilisateursRouter);

module.exports = app;

if (require.main === module) {
    app.listen(
        PORT, () => console.log(`Server is running on port ${PORT}`)
    );
}