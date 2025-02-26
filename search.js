// search.js
const JSONDataLoader = require('./JSONDataLoader');
const ContentRenderer = require('./ContentRenderer');
const NormalModeRenderer = require('./NormalModeRenderer');
const SearchHandler = require('./searchHandler');

async function handleSearch(req, res) {
    try {
        const data = await JSONDataLoader.load('./src/data.json');
        const query = req.query.q ? req.query.q.trim() : '';
        const expand = req.query.expand;

        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            // Requisição AJAX
            let renderedContent;
            if (!query) {
                renderedContent = NormalModeRenderer.display(data, false); // Modo normal para query vazia
            } else if (expand) {
                const fullArticle = SearchHandler.getFullArticleByNumber(expand, data);
                renderedContent = fullArticle 
                    ? ContentRenderer.renderArticleSearch(fullArticle, query, data, true) 
                    : '<p>Artigo não encontrado.</p>';
            } else {
                renderedContent = ContentRenderer.renderSearchResults(data, query);
            }
            res.send(renderedContent);
        } else {
            // Renderização para /search?q=query
            const renderedContent = query ? ContentRenderer.renderSearchResults(data, query) : NormalModeRenderer.display(data, false);
            res.render('index', { renderedContent, query });
        }
    } catch (error) {
        console.error("Erro ao realizar a pesquisa:", error);
        res.status(500).send("Erro ao realizar a pesquisa.");
    }
}

async function handleSearchAjax(req, data) {
    const query = req.query.q ? req.query.q.trim() : '';
    const expand = req.query.expand;
    if (!query) {
        return NormalModeRenderer.display(data, false); // Modo normal para query vazia
    } else if (expand) {
        const fullArticle = SearchHandler.getFullArticleByNumber(expand, data);
        return fullArticle ? ContentRenderer.renderArticleSearch(fullArticle, query, data, true) : '<p>Artigo não encontrado.</p>';
    }
    return ContentRenderer.renderSearchResults(data, query);
}

module.exports = { handleSearch, handleSearchAjax };

//stable