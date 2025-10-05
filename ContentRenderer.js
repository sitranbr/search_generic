// ContentRenderer.js
const NormalModeRenderer = require('./script/NormalModeRenderer');
const SearchModeRenderer = require('./script/SearchModeRenderer');
const Utils = require('./Utils');

class ContentRenderer {
    static renderSearchResults(data, query) {
        let html = '';
        const containsQuery = Utils.matchesText;

        data.content.forEach(topLevel => {
            const topLevelMatches = this.levelMatches(topLevel, query);
            if (topLevelMatches) {
                const headerClass = topLevel.id && topLevel.id.startsWith('parte') ? 'title-header' : 'article-chapter';
                html += `<p class="${headerClass}"><strong>${Utils.highlightText(topLevel.title || '', query)}</strong></p>`;
                if (topLevel.description && containsQuery(topLevel.description, query)) {
                    html += `<p class="observation">${Utils.highlightText(topLevel.description, query)}</p>`;
                }
                if (Array.isArray(topLevel.content)) {
                    topLevel.content.forEach(item => {
                        if (item.type === 'section') {
                            const sectionMatches = this.levelMatches(item, query);
                            if (sectionMatches) {
                                html += `<h3 class="section-header">${Utils.highlightText(item.title || '', query)}</h3>`;
                                if (item.description && containsQuery(item.description, query)) {
                                    html += `<p class="title-definition">${Utils.highlightText(item.description, query)}</p>`;
                                }
                                if (Array.isArray(item.content)) {
                                    item.content.forEach(subitem => {
                                        if (subitem.type === 'article') {
                                            const matchByAbbreviation = Utils.matchArticle(subitem, query);
                                            const matchByContent = Utils.itemMatches(subitem, query);
                                            if (matchByAbbreviation || matchByContent) {
                                                html += this.renderArticleSearch(subitem, query, data, false, !matchByAbbreviation);
                                            }
                                        } else if (subitem.type === 'anexo' && Utils.itemMatches(subitem, query)) {
                                            html += NormalModeRenderer.renderAnexo(subitem);
                                        } else if (subitem.type === 'subsection') {
                                            const subsectionMatches = this.levelMatches(subitem, query);
                                            if (subsectionMatches) {
                                                html += `<h4 class="subsection-header">${Utils.highlightText(subitem.title || '', query)}</h4>`;
                                                if (Array.isArray(subitem.content)) {
                                                    subitem.content.forEach(article => {
                                                        if (article.type === 'article') {
                                                            const matchByAbbreviation = Utils.matchArticle(article, query);
                                                            const matchByContent = Utils.itemMatches(article, query);
                                                            if (matchByAbbreviation || matchByContent) {
                                                                html += this.renderArticleSearch(article, query, data, false, !matchByAbbreviation);
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        } else if (item.type === 'article') {
                            const matchByAbbreviation = Utils.matchArticle(item, query);
                            const matchByContent = Utils.itemMatches(item, query);
                            if (matchByAbbreviation || matchByContent) {
                                html += this.renderArticleSearch(item, query, data, false, !matchByAbbreviation);
                            }
                        } else if (item.type === 'anexo' && Utils.itemMatches(item, query)) {
                            html += NormalModeRenderer.renderAnexo(item);
                        } else if (item.id && item.title) { // Livro ou Título no CCB
                            const subLevelMatches = this.levelMatches(item, query);
                            if (subLevelMatches) {
                                const subHeaderClass = item.id.startsWith('livro') ? 'book-header' : 'chapter-header';
                                html += `<p class="${subHeaderClass}"><strong>${Utils.highlightText(item.title || '', query)}</strong></p>`;
                                if (item.description && containsQuery(item.description, query)) {
                                    html += `<p class="observation">${Utils.highlightText(item.description, query)}</p>`;
                                }
                                if (Array.isArray(item.content)) {
                                    item.content.forEach(subitem => {
                                        if (subitem.type === 'section') {
                                            const sectionMatches = this.levelMatches(subitem, query);
                                            if (sectionMatches) {
                                                html += `<h3 class="section-header">${Utils.highlightText(subitem.title || '', query)}</h3>`;
                                                if (subitem.description && containsQuery(subitem.description, query)) {
                                                    html += `<p class="title-definition">${Utils.highlightText(subitem.description, query)}</p>`;
                                                }
                                                if (Array.isArray(subitem.content)) {
                                                    subitem.content.forEach(nestedItem => {
                                                        if (nestedItem.type === 'subsection') {
                                                            const subsectionMatches = this.levelMatches(nestedItem, query);
                                                            if (subsectionMatches) {
                                                                html += `<h4 class="subsection-header">${Utils.highlightText(nestedItem.title || '', query)}</h4>`;
                                                                if (Array.isArray(nestedItem.content)) {
                                                                    nestedItem.content.forEach(article => {
                                                                        if (article.type === 'article') {
                                                                            const matchByAbbreviation = Utils.matchArticle(article, query);
                                                                            const matchByContent = Utils.itemMatches(article, query);
                                                                            if (matchByAbbreviation || matchByContent) {
                                                                                html += this.renderArticleSearch(article, query, data, false, !matchByAbbreviation);
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        } else if (nestedItem.type === 'article') {
                                                            const matchByAbbreviation = Utils.matchArticle(nestedItem, query);
                                                            const matchByContent = Utils.itemMatches(nestedItem, query);
                                                            if (matchByAbbreviation || matchByContent) {
                                                                html += this.renderArticleSearch(nestedItem, query, data, false, !matchByAbbreviation);
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        } else if (subitem.id && subitem.title) { // Capítulo ou Título interno
                                            const chapterMatches = this.levelMatches(subitem, query);
                                            if (chapterMatches) {
                                                html += `<p class="chapter-header"><strong>${Utils.highlightText(subitem.title || '', query)}</strong></p>`;
                                                if (subitem.description && containsQuery(subitem.description, query)) {
                                                    html += `<p class="observation">${Utils.highlightText(subitem.description, query)}</p>`;
                                                }
                                                if (Array.isArray(subitem.content)) {
                                                    subitem.content.forEach(nestedItem => {
                                                        if (nestedItem.type === 'section') {
                                                            const sectionMatches = this.levelMatches(nestedItem, query);
                                                            if (sectionMatches) {
                                                                html += `<h3 class="section-header">${Utils.highlightText(nestedItem.title || '', query)}</h3>`;
                                                                if (nestedItem.description && containsQuery(nestedItem.description, query)) {
                                                                    html += `<p class="title-definition">${Utils.highlightText(nestedItem.description, query)}</p>`;
                                                                }
                                                                if (Array.isArray(nestedItem.content)) {
                                                                    nestedItem.content.forEach(article => {
                                                                        if (article.type === 'article') {
                                                                            const matchByAbbreviation = Utils.matchArticle(article, query);
                                                                            const matchByContent = Utils.itemMatches(article, query);
                                                                            if (matchByAbbreviation || matchByContent) {
                                                                                html += this.renderArticleSearch(article, query, data, false, !matchByAbbreviation);
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        } else if (nestedItem.type === 'article') {
                                                            const matchByAbbreviation = Utils.matchArticle(nestedItem, query);
                                                            const matchByContent = Utils.itemMatches(nestedItem, query);
                                                            if (matchByAbbreviation || matchByContent) {
                                                                html += this.renderArticleSearch(nestedItem, query, data, false, !matchByAbbreviation);
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        } else if (subitem.type === 'article') {
                                            const matchByAbbreviation = Utils.matchArticle(subitem, query);
                                            const matchByContent = Utils.itemMatches(subitem, query);
                                            if (matchByAbbreviation || matchByContent) {
                                                html += this.renderArticleSearch(subitem, query, data, false, !matchByAbbreviation);
                                            }
                                        } else if (subitem.type === 'anexo' && Utils.itemMatches(subitem, query)) {
                                            html += NormalModeRenderer.renderAnexo(subitem);
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
        
        // Verifica se não há resultados e retorna mensagem elegante
        if (!html.trim()) {
            return this.renderNoResultsMessage(query);
        }
        
        return html;
    }

    static renderNoResultsMessage(query) {
        return `
            <div class="no-results-container">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3 class="no-results-title">Nenhum resultado encontrado</h3>
                <p class="no-results-message">
                    Não foram encontrados resultados para "<strong>${query}</strong>".
                </p>
                <div class="no-results-suggestions">
                    <p>Sugestões:</p>
                    <ul>
                        <li>Verifique se a palavra está escrita corretamente</li>
                        <li>Tente usar termos mais gerais</li>
                        <li>Use abreviações como "art1", "art2", etc.</li>
                        <li>Experimente sinônimos ou termos relacionados</li>
                    </ul>
                </div>
            </div>
        `;
    }

    static levelMatches(item, query) {
        const containsQuery = Utils.matchesText;
        return (
            containsQuery(item.title, query) ||
            (item.description && containsQuery(item.description, query)) ||
            (Array.isArray(item.content) &&
                item.content.some(sub => 
                    Utils.itemMatches(sub, query) || 
                    (sub.type === 'article' && Utils.matchArticle(sub, query)) ||
                    ((sub.type === 'section' || sub.type === 'subsection' || (sub.id && sub.title)) && this.levelMatches(sub, query))
                ))
        );
    }

    static renderArticleSearch(article, query, data, expandAll = false, filterChildren = false) {
        const artNum = article.number || '';
        const artText = article.text || '';
        const fullMatch = Utils.matchesText(artText, query) || Utils.matchArticle(article, query);

        let html = '';
        let contentHtml = filterChildren
            ? SearchModeRenderer.renderFilteredArticleContent(article, query)
            : SearchModeRenderer.renderArticleContent(article, query, fullMatch, expandAll);
        const isPartial = !fullMatch && !expandAll && SearchModeRenderer.hasMoreContent(article, query);

        if (contentHtml) {
            html += `<div class="article-wrapper" data-article-id="${artNum}">`;
            html += `<h3 class="collapsible article-title active open">`;
            html += `<span class="icon">−</span>`;
            const summary = artText.length > 25 ? artText.substring(0, 25) + '...' : artText;
            html += `Art. ${artNum} - ${Utils.highlightText(summary, query)}</h3>`;
            html += `<div class="content" style="display: block;">${contentHtml}</div>`;
            if (isPartial) {
                html += Utils.createVerMaisLink(article, query);
            }
            html += `</div>`;
        }

        return html;
    }
}

module.exports = ContentRenderer;