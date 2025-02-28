// collapsible.js
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM carregado, buscando #searchForm');

  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
      console.log('Formulário #searchForm encontrado, adicionando listener');
      searchForm.addEventListener('submit', function(e) {
          e.preventDefault();
          console.log('Evento submit capturado');

          const searchInput = document.getElementById('searchInput');
          const contentElement = document.getElementById('content');
          const clearSearchButton = document.getElementById('clearSearchButton');
          const searchBtn = document.getElementById('search-btn');
          const route = window.location.pathname.split('/')[1] || 'ctb'; // Extrai 'ctb' ou 'cf' da URL
         
          if (searchInput && contentElement && clearSearchButton && searchBtn) {
              const query = searchInput.value.trim();
              console.log('Pesquisando:', query);

              clearSearchButton.classList.toggle('show', query !== '');
              searchBtn.style.display = query !== '' ? 'none' : 'block';
              const fetchUrl = query ? `/${route}/search?q=${encodeURIComponent(query)}` : `/${route}/search`;
              console.log('fetchUrl:', fetchUrl);
              fetch(fetchUrl, {
                  headers: {
                      'X-Requested-With': 'XMLHttpRequest'
                  }
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

              searchInput.blur();
          } else {
              console.error('Elementos necessários não encontrados');
          }
      });
  } else {
      console.warn('Formulário #searchForm não encontrado no DOM');
  }

  document.addEventListener('click', function(e) {
      const collapsible = e.target.closest('.collapsible');
      if (collapsible) {
          collapsible.classList.toggle('active');
          collapsible.classList.toggle('open');
          const content = collapsible.nextElementSibling;
          const icon = collapsible.querySelector('.icon');
          if (content) {
              content.style.display = content.style.display === 'block' ? 'none' : 'block';
              if (icon) icon.textContent = content.style.display === 'block' ? '−' : '+';
          }
          e.stopPropagation();
      }

      const expandLink = e.target.closest('.expand-link');
      if (expandLink) {
          e.preventDefault();
          const query = expandLink.getAttribute('data-query');
          const expand = expandLink.getAttribute('data-expand');
          const articleWrapper = expandLink.closest('.article-wrapper');
          const route = window.location.pathname.split('/')[1] || 'ctb';

          fetch(`/${route}/search?q=${query}&expand=${expand}`, {
              headers: {
                  'X-Requested-With': 'XMLHttpRequest'
              }
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

      const clearSearchButton = e.target.closest('#clearSearchButton');
      if (clearSearchButton) {
          e.preventDefault();
          const searchInput = document.getElementById('searchInput');
          const contentElement = document.getElementById('content');
          const route = window.location.pathname.split('/')[1] || 'ctb';
          if (searchInput && contentElement) {
              searchInput.value = '';
              clearSearchButton.classList.remove('show');
              document.getElementById('search-btn').style.display = 'block';

              fetch(`/${route}/search`, {
                  headers: {
                      'X-Requested-With': 'XMLHttpRequest'
                  }
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
      }
  });
});