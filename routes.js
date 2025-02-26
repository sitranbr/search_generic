// router.js
const express = require('express');
const router = express.Router();
const JSONDataLoader = require('./JSONDataLoader');
const NormalModeRenderer = require('./NormalModeRenderer');
const searchHandler = require('./search.js');

router.get('/', async (req, res) => {
    try {
        const data = await JSONDataLoader.load('./src/data.json');
        const query = req.query.q ? req.query.q.trim() : ''; // Trim para remover espaços em branco

        let renderedContent;
        if (!query) { // Se query é null, undefined ou string vazia após trim
            renderedContent = NormalModeRenderer.display(data, false); // Modo normal, sem expansão
        } else {
            renderedContent = await searchHandler.handleSearchAjax(req, data); // Modo pesquisa
        }

        res.render('index', { renderedContent, query });
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        res.status(500).send("Erro ao carregar os dados.");
    }
});

router.get('/search', searchHandler.handleSearch);

module.exports = router;