// Teste completo do fluxo de busca
const JSONDataLoader = require('./JSONDataLoader');
const ContentRenderer = require('./ContentRenderer');
const Utils = require('./Utils');

async function testSearch() {
    try {
        console.log('=== TESTE COMPLETO DE BUSCA ===');
        
        // Carregar dados
        const data = await JSONDataLoader.load('./src/data.json');
        console.log('Dados carregados, total de artigos:', data.content.length);
        
        // Buscar artigos menores que 10
        console.log('\n=== BUSCANDO ARTIGOS < 10 ===');
        const queries = ['art5', 'art5.', 'art.5', 'art1', 'art2', 'art3'];
        
        queries.forEach(query => {
            console.log(`\nBusca: "${query}"`);
            const results = ContentRenderer.renderSearchResults(data, query);
            const hasResults = results.length > 0 && results.includes('Art.');
            console.log(`Resultados encontrados: ${hasResults ? 'SIM' : 'NÃO'}`);
            if (hasResults) {
                // Extrair apenas os números dos artigos encontrados
                const articleMatches = results.match(/Art\.\s*(\d+)/g);
                console.log('Artigos encontrados:', articleMatches);
            }
        });
        
        // Verificar se artigos < 10 existem nos dados
        console.log('\n=== VERIFICANDO ARTIGOS < 10 NOS DADOS ===');
        function findArticlesLessThan10(content, level = 0) {
            let articles = [];
            if (Array.isArray(content)) {
                content.forEach(item => {
                    if (item.type === 'article' && item.number < 10) {
                        articles.push({
                            number: item.number,
                            text: item.text ? item.text.substring(0, 50) + '...' : 'Sem texto',
                            level: level
                        });
                    }
                    if (item.content) {
                        articles = articles.concat(findArticlesLessThan10(item.content, level + 1));
                    }
                });
            }
            return articles;
        }
        
        const articlesLessThan10 = findArticlesLessThan10(data.content);
        console.log('Artigos < 10 encontrados nos dados:', articlesLessThan10.length);
        articlesLessThan10.forEach(art => {
            console.log(`- Art. ${art.number}: ${art.text}`);
        });
        
    } catch (error) {
        console.error('Erro no teste:', error);
    }
}

testSearch();
