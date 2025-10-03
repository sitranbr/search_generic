// Teste específico do artigo 14
const JSONDataLoader = require('./JSONDataLoader');
const NormalModeRenderer = require('./NormalModeRenderer');
const ContentRenderer = require('./ContentRenderer');

async function testArticle14() {
    try {
        console.log('=== TESTE ARTIGO 14 ===');
        
        // Carregar dados
        const data = await JSONDataLoader.load('./src/data.json');
        
        // Encontrar artigo 14
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
        if (!article14) {
            console.log('Artigo 14 não encontrado');
            return;
        }
        
        console.log('Artigo 14 encontrado:');
        console.log('Texto:', article14.text);
        console.log('Items:', article14.items ? article14.items.length : 0);
        
        // Verificar item V com subitems
        const itemV = article14.items.find(item => item.item === 'V');
        if (itemV) {
            console.log('\nItem V:');
            console.log('Texto:', itemV.text);
            console.log('Subitems:', itemV.subitems ? itemV.subitems.length : 0);
            if (itemV.subitems) {
                itemV.subitems.forEach(subitem => {
                    console.log(`- ${subitem.letter}) ${subitem.text}`);
                });
            }
        }
        
        // Teste renderização normal
        console.log('\n=== RENDERIZAÇÃO NORMAL ===');
        const normalHtml = NormalModeRenderer.renderArticle(article14, false);
        console.log('HTML gerado (primeiros 500 chars):');
        console.log(normalHtml.substring(0, 500));
        
        // Verificar se contém as letras
        const hasLetters = normalHtml.includes('a)') && normalHtml.includes('b)');
        console.log('Contém letras dos subitems:', hasLetters);
        
        // Teste renderização de busca
        console.log('\n=== RENDERIZAÇÃO DE BUSCA ===');
        const searchHtml = ContentRenderer.renderArticleSearch(article14, 'JARI', data, false);
        console.log('HTML de busca gerado (primeiros 500 chars):');
        console.log(searchHtml.substring(0, 500));
        
        const searchHasLetters = searchHtml.includes('a)') && searchHtml.includes('b)');
        console.log('Busca contém letras dos subitems:', searchHasLetters);
        
    } catch (error) {
        console.error('Erro no teste:', error);
    }
}

testArticle14();
