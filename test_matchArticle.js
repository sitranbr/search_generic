// Teste da função matchArticle
const Utils = require('./Utils');

// Simulando artigo 5
const article5 = {
    number: 5,
    text: "Artigo 5 do CTB"
};

// Simulando artigo 10
const article10 = {
    number: 10,
    text: "Artigo 10 do CTB"
};

console.log('=== TESTE matchArticle ===');
console.log('Artigo 5:');
console.log('matchArticle(article5, "art5"):', Utils.matchArticle(article5, "art5"));
console.log('matchArticle(article5, "art5."):', Utils.matchArticle(article5, "art5."));
console.log('matchArticle(article5, "art.5"):', Utils.matchArticle(article5, "art.5"));

console.log('\nArtigo 10:');
console.log('matchArticle(article10, "art10"):', Utils.matchArticle(article10, "art10"));
console.log('matchArticle(article10, "art10."):', Utils.matchArticle(article10, "art10."));
console.log('matchArticle(article10, "art.10"):', Utils.matchArticle(article10, "art.10"));

// Teste detalhado da regex
console.log('\n=== TESTE REGEX ===');
const articlePattern = /^art\.?\s*(\d+)(?:[-\s]?([a-z]))?/i;

console.log('"art5" match:', "art5".match(articlePattern));
console.log('"art5." match:', "art5.".match(articlePattern));
console.log('"art10" match:', "art10".match(articlePattern));
console.log('"art10." match:', "art10.".match(articlePattern));
