// router.js
const express = require('express');
const path = require('path');
const router = express.Router();
const JSONDataLoader = require('./JSONDataLoader');
const NormalModeRenderer = require('./NormalModeRenderer');
const searchHandler = require('./search.js');

// Rota raiz - redireciona para CTB
router.get('/', (req, res) => {
    res.redirect('/ctb');
});

// Rota CTB
router.get('/ctb', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'src/data.json');
        console.log('Tentando carregar arquivo:', filePath);
        console.log('Diretório atual:', __dirname);
        
        const data = await JSONDataLoader.load(filePath);
        console.log('Dados carregados com sucesso');
        
        const query = req.query.q ? req.query.q.trim() : '';
        let renderedContent = query 
            ? await searchHandler.handleSearchAjax(req, data) 
            : NormalModeRenderer.display(data, false);
        res.render('index', { renderedContent, query, route: 'ctb' });
    } catch (error) {
        console.error("Erro ao carregar os dados do CTB:", error.stack);
        console.error("Caminho do arquivo:", path.join(__dirname, 'src/data.json'));
        res.status(500).send("Erro ao carregar os dados: " + error.message);
    }
});
router.get('/ctb/search', searchHandler.handleSearch);

// Rota CF
router.get('/cf', async (req, res) => {
    try {
        const data = await JSONDataLoader.load(path.join(__dirname, 'src/cf.json'));
        const query = req.query.q ? req.query.q.trim() : '';
        let renderedContent = query 
            ? await searchHandler.handleSearchAjax(req, data) 
            : NormalModeRenderer.display(data, false);
        res.render('index', { renderedContent, query, route: 'cf' });
    } catch (error) {
        console.error("Erro ao carregar os dados da CF:", error.stack);
        res.status(500).send("Erro ao carregar os dados.");
    }
});
router.get('/cf/search', searchHandler.handleSearch);

// Rota CCB
router.get('/ccb', async (req, res) => {
    try {
        const data = await JSONDataLoader.load(path.join(__dirname, 'src/ccb.json'));
        const query = req.query.q ? req.query.q.trim() : '';
        let renderedContent = query 
            ? await searchHandler.handleSearchAjax(req, data) 
            : NormalModeRenderer.display(data, false);
        res.render('index', { renderedContent, query, route: 'ccb' });
    } catch (error) {
        console.error("Erro ao carregar os dados do CCB:", error.stack);
        res.status(500).send("Erro ao carregar os dados.");
    }
});
router.get('/ccb/search', searchHandler.handleSearch);

module.exports = router;