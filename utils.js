// Utils.js
const SearchHandler = require('./script/searchHandler');

class Utils {
    static renderItemSearch(item, query, filterOptions = false) {
        let html = '';
        const label = item.item || '';
        const text = item.text || '';
        
        // Sempre renderiza o item pai se há subitems ou se o texto corresponde
        if (item.subitems && Array.isArray(item.subitems) && item.subitems.length > 0) {
            html += `<p class="item"><strong>${label}</strong> ${this.highlightText(text, query)}</p>`;
        } else {
            html += `<p class="item"><strong>${label}</strong> ${this.highlightText(text, query)}</p>`;
        }
        
        if (item.details) {
            html += this.renderDetails(item.details);
        }
        if (item.subitems && Array.isArray(item.subitems)) {
            item.subitems.forEach(subitem => {
                const letter = subitem.letter || '';
                const subText = subitem.text || '';
                let subitemHtml = '';

                // Se não está filtrando ou se o subitem corresponde à busca, renderiza
                if (!filterOptions || this.matchesText(subText, query)) {
                    subitemHtml += `<p class="alinea">${letter}) ${this.highlightText(subText, query)}</p>`;
                }

                if (subitem.options && Array.isArray(subitem.options)) {
                    const matchingOptions = filterOptions
                        ? subitem.options.filter(option => this.matchesText(option.text, query))
                        : subitem.options;

                    if (matchingOptions.length > 0) {
                        if (!subitemHtml) {
                            subitemHtml += `<p class="alinea">${letter}) ${this.highlightText(subText, query)}</p>`;
                        }
                        subitemHtml += `<ul class="options-list">`;
                        matchingOptions.forEach(option => {
                            const optNum = option.number || '';
                            const optText = option.text || '';
                            subitemHtml += `<li class="option"><strong>${optNum}.</strong> ${this.highlightText(optText, query)}</li>`;
                        });
                        subitemHtml += `</ul>`;
                    }
                }

                if (subitem.details) {
                    subitemHtml += this.renderDetails(subitem.details);
                }
                if (subitem.note && Array.isArray(subitem.note)) {
                    subitem.note.forEach(note => {
                        if (!filterOptions || this.matchesText(note.text, query)) {
                            subitemHtml += `<p class="item-note">- ${this.highlightText(note.text || '', query)}</p>`;
                        }
                    });
                }

                if (subitemHtml) {
                    html += subitemHtml;
                }
            });
        }
        if (item.note && Array.isArray(item.note)) {
            item.note.forEach(note => {
                if (!filterOptions || this.matchesText(note.text, query)) {
                    html += `<p class="item-note">- ${this.highlightText(note.text || '', query)}</p>`;
                }
            });
        }
        return html;
    }

    static itemMatches(item, query) {
        if (!item) return false;
        const q = query.toLowerCase();

        return (
            this.matchesText(item.item, q) ||
            this.matchesText(item.text, q) ||
            this.matchesDetails(item.details, q) ||
            this.matchesNotes(item.note, q) ||
            this.matchesItems(item.items, q) ||
            this.matchesSubitems(item.subitems, q) ||
            this.matchesOptions(item.options, q) || // Novo: verifica options diretamente
            this.matchesParagraphs(item.paragraphs, q) || // Novo: verifica parágrafos
            this.matchesObservations(item.observations, q) || // Novo: verifica observações
            this.matchesAnexo(item, q) ||
            this.matchesSection(item, q) ||
            this.matchArticle(item, q)
        );
    }

    // Novo método para options
    static matchesOptions(options, query) {
        return options && Array.isArray(options) && options.some(option => this.matchesText(option.text, query));
    }

    // Novo método para parágrafos
    static matchesParagraphs(paragraphs, query) {
        return paragraphs && Array.isArray(paragraphs) && paragraphs.some(paragraph => 
            this.matchesText(paragraph.text, query) ||
            this.matchesItems(paragraph.items, query) ||
            this.matchesNotes(paragraph.note, query)
        );
    }

    // Novo método para observações
    static matchesObservations(observations, query) {
        return observations && Array.isArray(observations) && observations.some(obs => this.matchesText(obs.text, query));
    }

    static matchesText(text, query) {
      if (!text || !query) return false;
      const normalizedText = Utils.removeAccents(text.toLowerCase());
      const normalizedQuery = Utils.removeAccents(query.toLowerCase());
      return normalizedText.includes(normalizedQuery);
  }

    static matchesDetails(details, query) {
        return details && Object.values(details).some(value => this.matchesText(value, query));
    }

    static matchesNotes(note, query) {
        return note && Array.isArray(note) && note.some(n => this.matchesText(n.text, query));
    }

    static matchesItems(items, query) {
        return items && Array.isArray(items) && items.some(sub => this.itemMatches(sub, query));
    }

    static matchesSubitems(subitems, query) {
        return subitems && Array.isArray(subitems) && (
            subitems.some(sub => this.matchesText(sub.text, query)) ||
            subitems.some(sub => sub.options && sub.options.some(opt => this.matchesText(opt.text, query)))
        );
    }

    static matchesAnexo(item, query) {
        return item.type === 'anexo' && (this.matchesText(item.label, query) || this.matchesText(item.text, query));
    }

    static matchesSection(item, query) {
        return item.type === 'section' && Array.isArray(item.content) && item.content.some(sub => this.itemMatches(sub, query));
    }

    static matchArticle(article, searchText) {
        if (!article || typeof article.number === 'undefined') return false;
        const articlePattern = /^art\.?\s*(\d+)(?:[-\s]?([a-z]))?/i;
        const match = searchText.match(articlePattern);
        if (!match) return false;

        const searchNumber = match[1];
        const searchLetter = match[2] ? match[2].toUpperCase() : '';
        let articleStr = article.number.toString().toUpperCase();
        let articleMatch = articleStr.match(/^(\d+)\s*[\-]?\s*([A-Z])?$/);

        if (!articleMatch) {
            return articleStr.replace(/[\-\s]/g, '') === (searchNumber + searchLetter);
        }

        const articleNumber = articleMatch[1];
        const articleLetter = articleMatch[2] || '';
        return articleNumber === searchNumber && articleLetter === searchLetter;
    }

    static createVerMaisLink(article, query) {
        return `<a href="#" class="expand-link" data-query="${encodeURIComponent(query)}" data-expand="${article.number}">Ver mais...</a>`;
    }

    static shouldAddVerMais(article, data) {
        const fullArticle = SearchHandler.getFullArticleByNumber(article.number, data);
        if (!fullArticle) return false;
        const currentItemsCount = article.items ? article.items.length : 0;
        const fullItemsCount = fullArticle.items ? fullArticle.items.length : 0;
        const currentParagraphsCount = article.paragraphs ? article.paragraphs.length : 0;
        const fullParagraphsCount = fullArticle.paragraphs ? fullArticle.paragraphs.length : 0;
        return fullItemsCount > currentItemsCount ||
               fullParagraphsCount > currentParagraphsCount ||
               fullArticle.text.length > article.text.length;
    }

    static highlightText(text, query) {
      if (!query || !text) return text;
      const searchText = query.toLowerCase().trim();
      if (!searchText) return text;

      const normalizedSearchText = Utils.removeAccents(searchText);

      const accentMap = {
          'a': 'aáàâãäå', 'e': 'eéèêë', 'i': 'iíìîï', 'o': 'oóòôõöø', 'u': 'uúùûü', 'c': 'cç'
      };

      let pattern = '';
      for (const char of normalizedSearchText) {
          pattern += accentMap[char] ? `[${accentMap[char]}${accentMap[char].toUpperCase()}]` : char;
      }

      const regex = new RegExp(`(${pattern})`, 'gi');
      return text.replace(regex, `<span class="highlightText">$1</span>`);
  }


    static removeAccents(text) {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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

module.exports = Utils;

//stable