// NormalModeRenderer.js
class NormalModeRenderer {
    static display(data, expandAll = false) {
        let html = '';
        data.content.forEach(topLevel => {
            html += this.renderLevel(topLevel, 'title-header', 'h2', expandAll);
        });
        return html;
    }

    static renderLevel(item, headerClass, headerTag, expandAll = false) {
        let html = '';
        const itemTitle = item.title || '';
        const itemId = item.id || '';
        html += `<div class="${headerClass.split('-')[0]}" id="${itemId}">`;
        html += `<${headerTag} class="${headerClass} collapsible${expandAll ? ' active open' : ''}">`;
        html += `<span class="icon">${expandAll ? '−' : '+'}</span>${itemTitle}</${headerTag}>`;
        html += `<div class="content" style="display: ${expandAll ? 'block' : 'none'};">`;
        if (item.description) {
            html += `<p class="observation">${item.description}</p>`;
        }
        if (Array.isArray(item.content)) {
            item.content.forEach(subItem => {
                if (subItem.id && subItem.title) { // Capítulo ou nível superior
                    html += this.renderLevel(subItem, 'chapter-header', 'h3', expandAll);
                } else if (subItem.type === 'section') {
                    html += this.renderLevel(subItem, 'section-header', 'h4', expandAll);
                } else if (subItem.type === 'subsection') {
                    html += this.renderLevel(subItem, 'subsection-header', 'h5', expandAll);
                } else if (subItem.type === 'article') {
                    html += this.renderArticle(subItem, expandAll);
                } else if (subItem.type === 'anexo') {
                    html += this.renderAnexo(subItem);
                }
            });
        }
        html += `</div></div>`;
        return html;
    }

    static renderArticle(article, expandAll = false) {
        let html = '';
        const artNum = article.number || '';
        const artText = article.text || '';
        html += `<div class="article-wrapper">`;
        html += `<h3 class="collapsible article-title${expandAll ? ' active open' : ''}">`;
        html += `<span class="icon">${expandAll ? '−' : '+'}</span>`;
        const summary = artText.length > 25 ? artText.substring(0, 25) + '...' : artText;
        html += `Art. ${artNum} - ${summary}</h3>`;
        html += `<div class="content" style="display: ${expandAll ? 'block' : 'none'};">`;
        html += `<p><strong>Art. ${artNum}</strong> ${artText}</p>`;
        if (article.items && Array.isArray(article.items)) {
            html += this.renderItems(article.items);
        }
        if (article.details) {
            html += this.renderDetails(article.details);
        }
        if (article.paragraphs && Array.isArray(article.paragraphs)) {
            html += this.renderParagraphs(article.paragraphs);
        }
        if (article.observations && Array.isArray(article.observations)) {
            html += this.renderObservations(article.observations);
        }
        html += `</div></div>`;
        return html;
    }

    static renderItems(items) {
        let html = '';
        items.forEach(item => {
            html += this.renderItem(item);
        });
        return html;
    }

    static renderItem(item) {
        let html = '';
        const label = item.item || '';
        const text = item.text || '';
        html += `<p class="item"><strong>${label}</strong> ${text}</p>`;
        if (item.details) {
            html += this.renderDetails(item.details);
        }
        if (item.subitems && Array.isArray(item.subitems)) {
            item.subitems.forEach(subitem => {
                const letter = subitem.letter || '';
                const subText = subitem.text || '';
                html += `<p class="alinea">${letter}) ${subText}</p>`;
                if (subitem.options && Array.isArray(subitem.options)) {
                    html += `<ul class="options-list">`;
                    subitem.options.forEach(option => {
                        const optNum = option.number || '';
                        const optText = option.text || '';
                        html += `<li class="option"><strong>${optNum}.</strong> ${optText}</li>`;
                    });
                    html += `</ul>`;
                }
                if (subitem.details) {
                    html += this.renderDetails(subitem.details);
                }
                if (subitem.note && Array.isArray(subitem.note)) {
                    html += this.renderNotes(subitem.note);
                }
            });
        }
        if (item.note && Array.isArray(item.note)) {
            html += this.renderNotes(item.note);
        }
        return html;
    }

    static renderParagraphs(paragraphs) {
        let html = '';
        paragraphs.forEach(paragraph => {
            const parNum = paragraph.number || 'Parágrafo único.';
            html += `<p class="paragraph"><strong>${parNum}</strong> ${paragraph.text || ''}</p>`;
            if (paragraph.items && Array.isArray(paragraph.items)) {
                html += this.renderItems(paragraph.items);
            }
            if (paragraph.note && Array.isArray(paragraph.note)) {
                html += this.renderNotes(paragraph.note);
            }
        });
        return html;
    }

    static renderObservations(observations) {
        let html = '';
        observations.forEach(obs => {
            html += `<p class="observation">${obs.text || ''}</p>`;
        });
        return html;
    }

    static renderNotes(notes) {
        let html = '';
        notes.forEach(note => {
            html += `<p class="item-note">- ${note.text || ''}</p>`;
        });
        return html;
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

    static renderAnexo(anexo) {
        let html = `<div class="anexo">`;
        html += `<h5>${anexo.label || ''}</h5>`;
        html += `<p>${anexo.text || ''}</p>`;
        html += `</div>`;
        return html;
    }
}

module.exports = NormalModeRenderer;