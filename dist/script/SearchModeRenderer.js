// SearchModeRenderer.js
const Utils = require('../Utils');

class SearchModeRenderer {
    static renderArticleContent(article, query, fullMatch, expandAll) {
        let contentHtml = `<p><strong>Art. ${article.number || ''}</strong> ${Utils.highlightText(article.text || '', query)}</p>`;
        return contentHtml + (fullMatch || expandAll ? this.renderFullContent(article, query) : this.renderFilteredContent(article, query));
    }

    static renderFullContent(article, query) {
        let contentHtml = '';
        if (article.items && Array.isArray(article.items)) {
            contentHtml += this.renderItems(article.items, query);
        }
        if (article.details) {
            contentHtml += this.renderDetails(article.details);
        }
        if (article.paragraphs && Array.isArray(article.paragraphs)) {
            contentHtml += this.renderParagraphs(article.paragraphs, query, true);
        }
        if (article.observations && Array.isArray(article.observations)) {
            contentHtml += this.renderObservations(article.observations, query);
        }
        return contentHtml;
    }

    static renderFilteredArticleContent(article, query) {
        let contentHtml = `<p><strong>Art. ${article.number || ''}</strong> ${Utils.highlightText(article.text || '', query)}</p>`;
        if (Utils.matchesText(article.text, query)) {
            contentHtml += this.renderFullContent(article, query); // Mostra tudo se o texto principal corresponde
        } else {
            contentHtml += this.renderFilteredContent(article, query); // Filtra apenas nós relevantes
        }
        return contentHtml;
    }

    static renderFilteredContent(article, query) {
        let contentHtml = '';
        if (article.items && Array.isArray(article.items)) {
            contentHtml += this.renderFilteredItems(article.items, query);
        }
        if (article.details && Utils.matchesDetails(article.details, query)) {
            contentHtml += this.renderDetails(article.details); // Inclui details se contiver o termo
        }
        if (article.paragraphs && Array.isArray(article.paragraphs)) {
            contentHtml += this.renderFilteredParagraphs(article.paragraphs, query);
        }
        if (article.observations && Array.isArray(article.observations)) {
            contentHtml += this.renderFilteredObservations(article.observations, query);
        }
        return contentHtml;
    }

    static renderItems(items, query) {
        let html = '';
        items.forEach(item => {
            html += Utils.renderItemSearch(item, query, false); // false = não filtrar, mostrar todos os subitems
        });
        return html;
    }

    static renderFilteredItems(items, query) {
        let html = '';
        items.forEach(item => {
            if (Utils.matchesText(item.text, query)) {
                html += Utils.renderItemSearch(item, query, false); // Mostra todos os filhos se o item contém o termo
            } else if (item.details && Utils.matchesDetails(item.details, query)) {
                html += Utils.renderItemSearch({ item: item.item, text: item.text, details: item.details }, query, false); // Inclui details
            } else if (item.subitems && Array.isArray(item.subitems)) {
                item.subitems.forEach(subitem => {
                    if (Utils.matchesText(subitem.text, query)) {
                        html += Utils.renderItemSearch({ item: item.item, text: item.text, subitems: [subitem] }, query, false);
                    } else if (subitem.details && Utils.matchesDetails(subitem.details, query)) {
                        html += Utils.renderItemSearch({ item: item.item, text: item.text, subitems: [{ letter: subitem.letter, text: subitem.text, details: subitem.details }] }, query, false);
                    } else if (subitem.options && Array.isArray(subitem.options)) {
                        const relevantOptions = subitem.options.filter(option => Utils.matchesText(option.text, query));
                        if (relevantOptions.length > 0) {
                            html += Utils.renderItemSearch({ item: item.item, text: item.text, subitems: [{ letter: subitem.letter, text: subitem.text, options: relevantOptions }] }, query, false);
                        }
                    } else if (subitem.note && Array.isArray(subitem.note)) {
                        const relevantNotes = subitem.note.filter(note => Utils.matchesText(note.text, query));
                        if (relevantNotes.length > 0) {
                            html += Utils.renderItemSearch({ item: item.item, text: item.text, subitems: [{ letter: subitem.letter, text: subitem.text, note: relevantNotes }] }, query, false);
                        }
                    }
                });
            } else if (item.note && Array.isArray(item.note)) {
                const relevantNotes = item.note.filter(note => Utils.matchesText(note.text, query));
                if (relevantNotes.length > 0) {
                    html += Utils.renderItemSearch({ item: item.item, text: item.text, note: relevantNotes }, query, false);
                }
            }
        });
        return html;
    }

    static renderParagraphs(paragraphs, query, renderAll) {
        let html = '';
        paragraphs.forEach(paragraph => {
            let paragraphContent = '';
            const parNum = paragraph.number || 'Parágrafo único.';
            if (renderAll || Utils.matchesText(paragraph.text, query)) {
                paragraphContent += `<p class="paragraph"><strong>${parNum}</strong> ${Utils.highlightText(paragraph.text || '', query)}</p>`;
            }
            if (paragraph.details && Utils.matchesDetails(paragraph.details, query)) {
                paragraphContent += this.renderDetails(paragraph.details); // Inclui details em parágrafos
            }
            if (paragraph.items && Array.isArray(paragraph.items)) {
                paragraphContent += renderAll ? this.renderItems(paragraph.items, query) : this.renderFilteredItems(paragraph.items, query);
            }
            if (paragraph.note && Array.isArray(paragraph.note)) {
                paragraphContent += renderAll ? this.renderNotes(paragraph.note, query) : this.renderFilteredNotes(paragraph.note, query);
            }
            if (paragraphContent) {
                html += paragraphContent;
            }
        });
        return html;
    }

    static renderFilteredParagraphs(paragraphs, query) {
        let html = '';
        paragraphs.forEach(paragraph => {
            if (Utils.matchesText(paragraph.text, query)) {
                const parNum = paragraph.number || 'Parágrafo único.';
                html += `<p class="paragraph"><strong>${parNum}</strong> ${Utils.highlightText(paragraph.text || '', query)}</p>`;
                if (paragraph.details) {
                    html += this.renderDetails(paragraph.details); // Inclui details se o parágrafo contém o termo
                }
                if (paragraph.items && Array.isArray(paragraph.items)) {
                    html += this.renderItems(paragraph.items, query);
                }
                if (paragraph.note && Array.isArray(paragraph.note)) {
                    html += this.renderNotes(paragraph.note, query);
                }
            } else if (paragraph.details && Utils.matchesDetails(paragraph.details, query)) {
                const parNum = paragraph.number || 'Parágrafo único.';
                html += `<p class="paragraph"><strong>${parNum}</strong> ${Utils.highlightText(paragraph.text || '', query)}</p>`;
                html += this.renderDetails(paragraph.details); // Inclui details se contiver o termo
            } else if (paragraph.items && Array.isArray(paragraph.items)) {
                const filteredItems = this.renderFilteredItems(paragraph.items, query);
                if (filteredItems) {
                    const parNum = paragraph.number || 'Parágrafo único.';
                    html += `<p class="paragraph"><strong>${parNum}</strong> ${Utils.highlightText(paragraph.text || '', query)}</p>`;
                    html += filteredItems;
                }
            } else if (paragraph.note && Array.isArray(paragraph.note)) {
                const relevantNotes = paragraph.note.filter(note => Utils.matchesText(note.text, query));
                if (relevantNotes.length > 0) {
                    const parNum = paragraph.number || 'Parágrafo único.';
                    html += `<p class="paragraph"><strong>${parNum}</strong> ${Utils.highlightText(paragraph.text || '', query)}</p>`;
                    html += this.renderNotes(relevantNotes, query);
                }
            }
        });
        return html;
    }

    static renderObservations(observations, query) {
        let html = '';
        observations.forEach(obs => {
            html += `<p class="observation">${Utils.highlightText(obs.text || '', query)}</p>`;
        });
        return html;
    }

    static renderFilteredObservations(observations, query) {
        let html = '';
        observations.forEach(obs => {
            if (Utils.matchesText(obs.text, query)) {
                html += `<p class="observation">${Utils.highlightText(obs.text || '', query)}</p>`;
            }
        });
        return html;
    }

    static renderNotes(notes, query) {
        let html = '';
        notes.forEach(note => {
            html += `<p class="item-note">- ${Utils.highlightText(note.text || '', query)}</p>`;
        });
        return html;
    }

    static renderFilteredNotes(notes, query) {
        let html = '';
        notes.forEach(note => {
            if (Utils.matchesText(note.text, query)) {
                html += `<p class="item-note">- ${Utils.highlightText(note.text || '', query)}</p>`;
            }
        });
        return html;
    }

    static hasMoreContent(article, query) {
        let totalChildren = 0;
        let matchedChildren = 0;

        if (article.items && Array.isArray(article.items)) {
            totalChildren += article.items.length;
            matchedChildren += article.items.filter(item => Utils.itemMatches(item, query)).length;
        }
        if (article.paragraphs && Array.isArray(article.paragraphs)) {
            totalChildren += article.paragraphs.length;
            matchedChildren += article.paragraphs.filter(paragraph => 
                Utils.matchesText(paragraph.text, query) ||
                (paragraph.items && paragraph.items.some(item => Utils.itemMatches(item, query))) ||
                (paragraph.details && Utils.matchesDetails(paragraph.details, query)) || // Inclui details
                (paragraph.note && paragraph.note.some(note => Utils.matchesText(note.text, query)))
            ).length;
            article.paragraphs.forEach(paragraph => {
                if (paragraph.items) totalChildren += paragraph.items.length;
                if (paragraph.note) totalChildren += paragraph.note.length;
            });
        }
        if (article.observations && Array.isArray(article.observations)) {
            totalChildren += article.observations.length;
            matchedChildren += article.observations.filter(obs => Utils.matchesText(obs.text, query)).length;
        }

        return totalChildren > matchedChildren;
    }

    static renderDetails(details) {
        let html = `<div class="article-details">`;
        if (details.infracao) html += `<strong>Infração:</strong> ${details.infracao}<br>`;
        if (details.penalidade) html += `<strong>Penalidade:</strong> ${details.penalidade}<br>`;
        if (details.medida_administrativa) html += `<strong>Medida Administrativa:</strong> ${details.medida_administrativa}<br>`;
        if (details.infrator) html += `<strong>Infrator:</strong> ${details.infrator}`;
        html += `</div>`;
        return html;
    }
}

module.exports = SearchModeRenderer;