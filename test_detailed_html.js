// Teste detalhado do HTML gerado
const JSONDataLoader = require('./JSONDataLoader');
const ContentRenderer = require('./ContentRenderer');

async function testDetailedHTML() {
    try {
        console.log('=== TESTE DETALHADO HTML ===');
        
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
        const searchHtml = ContentRenderer.renderArticleSearch(article14, 'JARI', data, false);
        
        console.log('HTML completo gerado:');
        console.log(searchHtml);
        
        // Verificar se contém elementos específicos
        console.log('\n=== VERIFICAÇÕES ===');
        console.log('Contém "V":', searchHtml.includes('<strong>V</strong>'));
        console.log('Contém "julgar os RECURSOS":', searchHtml.includes('julgar os RECURSOS'));
        console.log('Contém "a)":', searchHtml.includes('a)'));
        console.log('Contém "b)":', searchHtml.includes('b)'));
        console.log('Contém "das JARI":', searchHtml.includes('das JARI'));
        
        // Extrair apenas a parte dos subitems
        const subitemMatch = searchHtml.match(/<p class="alinea">.*?<\/p>/g);
        if (subitemMatch) {
            console.log('\nSubitems encontrados:');
            subitemMatch.forEach(match => console.log(match));
        } else {
            console.log('\nNenhum subitem encontrado no HTML');
        }
        
    } catch (error) {
        console.error('Erro no teste:', error);
    }
}

testDetailedHTML();
