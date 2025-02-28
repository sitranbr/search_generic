// search.js
const JSONDataLoader = require('./JSONDataLoader');
const ContentRenderer = require('./ContentRenderer');
const NormalModeRenderer = require('./NormalModeRenderer');
const SearchHandler = require('./searchHandler');

async function handleSearch(req, res) {
    try {
        console.log('Iniciando handleSearch com req.query:', req.query);
        const route = req.path.split('/')[1] || 'ctb'; // Captura 'ctb' ou 'cf' do path
        const jsonPath = route === 'ctb' ? './src/data.json' : './src/cf.json';
        const data = await JSONDataLoader.load(jsonPath);
        console.log('Dados carregados com sucesso, tamanho:', data.content.length);

        const query = req.query.q ? req.query.q.trim() : '';
        const expand = req.query.expand;
        console.log('Route:', route, 'Query:', query, 'Expand:', expand);

        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            console.log('Requisição AJAX detectada');
            let renderedContent;
            if (!query) {
                console.log('Query vazia, renderizando modo normal');
                renderedContent = NormalModeRenderer.display(data, false);
            } else if (expand) {
                console.log('Expandindo artigo:', expand);
                const fullArticle = SearchHandler.getFullArticleByNumber(expand, data);
                renderedContent = fullArticle 
                    ? ContentRenderer.renderArticleSearch(fullArticle, query, data, true) 
                    : '<p>Artigo não encontrado.</p>';
            } else {
                console.log('Renderizando resultados da busca para:', query);
                renderedContent = ContentRenderer.renderSearchResults(data, query);
                console.log('Renderização concluída, tamanho do HTML:', renderedContent.length);
            }
            console.log('Enviando resposta AJAX');
            res.send(renderedContent);
        } else {
            console.log('Requisição normal, renderizando index');
            const renderedContent = query ? ContentRenderer.renderSearchResults(data, query) : NormalModeRenderer.display(data, false);
            res.render('index', { renderedContent, query, route });
        }
    } catch (error) {
        console.error('Erro detalhado ao realizar a pesquisa:', error.stack);
        res.status(500).send('Erro ao realizar a pesquisa: ' + error.message);
    }
}

async function handleSearchAjax(req, data) {
    const query = req.query.q ? req.query.q.trim() : '';
    const expand = req.query.expand;
    if (!query) {
        return NormalModeRenderer.display(data, false);
    } else if (expand) {
        const fullArticle = SearchHandler.getFullArticleByNumber(expand, data);
        return fullArticle ? ContentRenderer.renderArticleSearch(fullArticle, query, data, true) : '<p>Artigo não encontrado.</p>';
    }
    return ContentRenderer.renderSearchResults(data, query);
}

module.exports = { handleSearch, handleSearchAjax };