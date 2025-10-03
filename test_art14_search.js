// Teste específico da busca por "art14"
const JSONDataLoader = require('./JSONDataLoader');
const ContentRenderer = require('./ContentRenderer');
const Utils = require('./Utils');

async function testArt14Search() {
    try {
        console.log('=== TESTE BUSCA "art14" ===');
        
        const data = await JSONDataLoader.load('./src/data.json');
        
        function findArticle14(content) {
            if (Array.isArray(content)) {
                for (let item of content) {
                    if (item.type === 'article' && item.number === 14) {
                        return item;
                    }
                    if (item.content) {
                        const found = findArticle14(item.content);
                        if (found) return found;
                    }
                }
            }
            return null;
        }
        
        const article14 = findArticle14(data.content);
        
        // Teste da função matchArticle
        console.log('matchArticle(article14, "art14"):', Utils.matchArticle(article14, "art14"));
        console.log('matchArticle(article14, "art14."):', Utils.matchArticle(article14, "art14."));
        
        // Teste de renderização de busca
        console.log('\n=== RENDERIZAÇÃO DE BUSCA ===');
        const searchHtml = ContentRenderer.renderArticleSearch(article14, 'art14', data, false);
        console.log('HTML gerado:');
        console.log(searchHtml);
        
        // Verificar se contém subitems
        console.log('\n=== VERIFICAÇÕES ===');
        console.log('Contém "V":', searchHtml.includes('<strong>V</strong>'));
        console.log('Contém "a)":', searchHtml.includes('a)'));
        console.log('Contém "b)":', searchHtml.includes('b)'));
        console.log('Contém "julgar os RECURSOS":', searchHtml.includes('julgar os RECURSOS'));
        
        // Verificar se é uma busca por abreviação
        const isAbbreviationMatch = Utils.matchArticle(article14, 'art14');
        console.log('É busca por abreviação:', isAbbreviationMatch);
        
        // Teste com renderização completa
        console.log('\n=== RENDERIZAÇÃO COMPLETA ===');
        const fullHtml = ContentRenderer.renderArticleSearch(article14, 'art14', data, true);
        console.log('HTML completo gerado:');
        console.log(fullHtml);
        
        console.log('\nContém subitems na renderização completa:');
        console.log('Contém "a)":', fullHtml.includes('a)'));
        console.log('Contém "b)":', fullHtml.includes('b)'));
        
    } catch (error) {
        console.error('Erro no teste:', error);
    }
}

testArt14Search();
