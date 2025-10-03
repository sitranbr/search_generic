// collapsible.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, buscando #searchForm');

    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        console.log('Formulário #searchForm encontrado, adicionando listener');
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch(); // Reutiliza a lógica de busca
        });

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            // Adiciona debounce para pesquisa automática
            searchInput.addEventListener('input', debounce(performSearch, 300));
        } else {
            console.warn('searchInput não encontrado no DOM');
        }
    } else {
        console.warn('Formulário #searchForm não encontrado no DOM');
    }
});

document.addEventListener('click', function(e) {
    handleCollapsibleClick(e);
    handleExpandLinkClick(e);
    handleClearSearchClick(e);
});

function handleCollapsibleClick(e) {
    const collapsible = e.target.closest('.collapsible');
    if (!collapsible) return;

    collapsible.classList.toggle('active');
    collapsible.classList.toggle('open');
    const content = collapsible.nextElementSibling;
    const icon = collapsible.querySelector('.icon');
    
    if (content) {
        toggleContentDisplay(content, icon);
    }
    e.stopPropagation();
}

function toggleContentDisplay(content, icon) {
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
    if (icon) {
        icon.textContent = content.style.display === 'block' ? '−' : '+';
    }
}

function handleExpandLinkClick(e) {
    const expandLink = e.target.closest('.expand-link');
    if (!expandLink) return;

    e.preventDefault();
    const query = expandLink.getAttribute('data-query');
    const expand = expandLink.getAttribute('data-expand');
    const articleWrapper = expandLink.closest('.article-wrapper');
    const route = window.location.pathname.split('/')[1] || 'ctb';

    fetch(`/${route}/search?q=${query}&expand=${expand}`, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro na requisição');
        return response.text();
    })
    .then(html => {
        articleWrapper.outerHTML = html;
    })
    .catch(error => {
        console.error('Erro ao expandir artigo:', error);
        articleWrapper.querySelector('.content').innerHTML += '<p>Erro ao carregar o artigo completo.</p>';
    });

    expandLink.style.display = 'none';
}

function handleClearSearchClick(e) {
    const clearSearchButton = e.target.closest('#clearSearchButton');
    if (!clearSearchButton) return;

    e.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const contentElement = document.getElementById('content');
    const route = window.location.pathname.split('/')[1] || 'ctb';

    if (searchInput && contentElement) {
        clearSearchInput(searchInput, clearSearchButton, contentElement, route);
    }
}

function clearSearchInput(searchInput, clearSearchButton, contentElement, route) {
    searchInput.value = '';
    clearSearchButton.classList.remove('show');
    document.getElementById('search-btn').style.display = 'block';

    fetch(`/${route}/search`, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro na requisição');
        return response.text();
    })
    .then(html => {
        contentElement.innerHTML = html;
    })
    .catch(error => console.error('Erro ao limpar pesquisa:', error));
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const contentElement = document.getElementById('content');
    const clearSearchButton = document.getElementById('clearSearchButton');
    const searchBtn = document.getElementById('search-btn');
    const route = window.location.pathname.split('/')[1] || 'ctb';

    if (!searchInput || !contentElement || !clearSearchButton || !searchBtn) {
        console.error('Elementos necessários não encontrados');
        return;
    }

    const query = searchInput.value.trim();
    console.log('Pesquisando:', query);

    // Atualiza UI independentemente do comprimento, mas só faz fetch se > 4
    clearSearchButton.classList.toggle('show', query.length > 0);
    searchBtn.style.display = query.length > 0 ? 'none' : 'block';

    // Realiza a busca apenas se o termo tiver mais de 2 caracteres
    // Exceção para abreviações de artigos (art1, art2, etc.)
    const isArticleAbbreviation = /^art\.?\d+\.?$/i.test(query);
    if (query.length <= 2 && !isArticleAbbreviation) {
        console.log('Termo muito curto, busca não realizada:', query);
        return; // Impede a busca para termos muito curtos
    }

    const fetchUrl = query ? `/${route}/search?q=${encodeURIComponent(query)}` : `/${route}/search`;
    fetch(fetchUrl, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro na requisição: ' + response.status);
        return response.text();
    })
    .then(html => {
        console.log('Conteúdo recebido, atualizando #content');
        contentElement.innerHTML = html;
    })
    .catch(error => console.error('Erro ao realizar pesquisa:', error));

    //searchInput.blur();
}

// Função de debounce para evitar chamadas excessivas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}