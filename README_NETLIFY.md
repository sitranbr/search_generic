# Deploy na Netlify

Este projeto foi configurado para deploy na Netlify usando Netlify Functions.

## Configuração

### Arquivos criados/modificados:

1. **netlify.toml** - Configuração principal do Netlify
2. **package.json** - Scripts de build atualizados
3. **netlify/functions/** - Estrutura para Netlify Functions

### Como fazer o deploy:

1. **Conectar ao GitHub/GitLab:**
   - Faça push do código para um repositório
   - Conecte o repositório na Netlify

2. **Configurações de build na Netlify:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

3. **Variáveis de ambiente (se necessário):**
   - Acesse Site settings > Environment variables
   - Adicione as variáveis necessárias

### Estrutura de arquivos:

```
search_generic/
├── netlify.toml
├── package.json (atualizado)
├── netlify/
│   └── functions/
│       ├── index.js
│       ├── server.js
│       └── viewConfig.js
└── README_NETLIFY.md
```

### Scripts disponíveis:

- `npm run build` - Prepara os arquivos para deploy
- `npm run serve` - Executa localmente
- `npm run dev` - Desenvolvimento com nodemon

### Notas importantes:

- O projeto usa Express.js com EJS
- As rotas estão em `/ctb`, `/cf`, `/ccb`
- Os dados JSON estão na pasta `src/`
- Arquivos estáticos na pasta `public/`

### Troubleshooting:

Se houver problemas no deploy:
1. Verifique os logs de build na Netlify
2. Teste localmente com `npm run build && npm run serve`
3. Verifique se todas as dependências estão no package.json
