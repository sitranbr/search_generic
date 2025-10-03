const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

// Ativa o CORS
app.use(cors());

// Importa a configuração de views e arquivos estáticos
require('./viewConfig')(app);

// Importa as rotas definidas em routes.js
const routes = require('./routes');
app.use('/', routes);

// Handler para Netlify Functions
const handler = serverless(app);

module.exports = { handler };
