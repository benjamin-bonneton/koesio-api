require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 3000;

const livresRouter = require('./routes/livres');
const auteursRouter = require('./routes/auteurs');
const empruntsRouter = require('./routes/emprunts');
const utilisateursRouter = require('./routes/utilisateurs');
const authentification = require('./packages/authentification');

app.use(express.json())

app.use('/', authentification, livresRouter);
app.use('/', authentification, auteursRouter);
app.use('/', authentification, empruntsRouter);
app.use('/', authentification, utilisateursRouter);

app.listen(
    PORT,
    () => console.log(`Server is running on port ${PORT}`)
)
