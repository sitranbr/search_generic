// ContentRenderer.js
const SearchHandler = require('./searchHandler');
const NormalModeRenderer = require('./NormalModeRenderer');
const SearchModeRenderer = require('./SearchModeRenderer');
const Utils = require('./Utils');

class ContentRenderer {
    static renderSearchResults(data, query) {
        let html = '';
        const containsQuery = Utils.matchesText;

        data.content.forEach(chapter => {
            const chapterMatches =
                containsQuery(chapter.title, query) ||
                containsQuery(chapter.description, query) ||
                (Array.isArray(chapter.content) &&
                    chapter.content.some(item => 
                        Utils.itemMatches(item, query) || 
                        (item.type === 'article' && Utils.matchArticle(item, query))
                    ));

            if (chapterMatches) {
                html += `<p class="article-chapter"><strong>${Utils.highlightText(chapter.title, query)}</strong></p>`;
                if (Array.isArray(chapter.content)) {
                    chapter.content.forEach(item => {
                        if (item.type === 'section') {
                            const sectionMatches =
                                containsQuery(item.title, query) ||
                                containsQuery(item.description, query) ||
                                (Array.isArray(item.content) &&
                                    item.content.some(sub => 
                                        Utils.itemMatches(sub, query) || 
                                        (sub.type === 'article' && Utils.matchArticle(sub, query))
                                    ));
                            if (sectionMatches) {
                                html += `<h3 class="section-header">${Utils.highlightText(item.title, query)}</h3>`;
                                html += `<div class="content" style="display: block;">`;
                                if (item.description) {
                                    html += `<p class="title-definition">${Utils.highlightText(item.description, query)}</p>`;
                                }
                                if (Array.isArray(item.content)) {
                                    item.content.forEach(subitem => {
                                        if (subitem.type === 'article' && (Utils.itemMatches(subitem, query) || Utils.matchArticle(subitem, query))) {
                                            html += this.renderArticleSearch(subitem, query, data, false);
                                        } else if (subitem.type === 'anexo') {
                                            html += NormalModeRenderer.renderAnexo(subitem);
                                        } else if (subitem.type === 'section') {
                                            html += NormalModeRenderer.renderSection(subitem, true);
                                        }
                                    });
                                }
                                html += `</div>`;
                            }
                        } else if (item.type === 'article' && (Utils.itemMatches(item, query) || Utils.matchArticle(item, query))) {
                            html += this.renderArticleSearch(item, query, data, false);
                        } else if (item.type === 'anexo' && Utils.itemMatches(item, query)) {
                            html += NormalModeRenderer.renderAnexo(item);
                        }
                    });
                }
            }
        });
        return html;
    }

    static renderArticleSearch(article, query, data, expandAll = false) {
        const artNum = article.number || '';
        const artText = article.text || '';
        const fullMatch = Utils.matchesText(artText, query) || Utils.matchArticle(article, query);

        let html = '';
        let contentHtml = SearchModeRenderer.renderArticleContent(article, query, fullMatch, expandAll);
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