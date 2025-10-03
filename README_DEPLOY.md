# Deploy para Hospedagem Node.js Tradicional

Este projeto foi configurado para hospedagem Node.js tradicional (Heroku, Railway, DigitalOcean, etc.).

## Configuração

### Arquivos principais:
- `server.js` - Servidor Express.js
- `start.js` - Arquivo de inicialização
- `routes.js` - Rotas da aplicação
- `package.json` - Dependências e scripts

### Scripts disponíveis:
- `npm start` - Inicia o servidor (produção)
- `npm run dev` - Desenvolvimento com nodemon
- `npm run build` - Prepara arquivos para deploy

### Variáveis de ambiente:
```bash
PORT=3000  # Porta do servidor (opcional)
NODE_ENV=production
```

## Deploy em diferentes plataformas:

### Heroku:
1. `git push heroku main`
2. Configurar variável `NODE_ENV=production`

### Railway:
1. Conectar repositório GitHub
2. Deploy automático

### DigitalOcean App Platform:
1. Conectar repositório
2. Configurar build command: `npm run build`
3. Start command: `npm start`

### VPS/Servidor próprio:
1. `git clone <repo>`
2. `npm install`
3. `npm start`

## Estrutura de arquivos:
```
dist/
├── server.js
├── start.js
├── routes.js
├── src/
│   ├── data.json
│   ├── cf.json
│   └── cc.json
├── views/
│   └── index.ejs
└── public/
    ├── css/
    └── script/
```

## Rotas disponíveis:
- `/` - Redireciona para `/ctb`
- `/ctb` - Código de Trânsito Brasileiro
- `/cf` - Código Florestal
- `/ccb` - Código Civil Brasileiro

## Notas:
- Removidas dependências do Netlify Functions
- Configuração simplificada para Node.js tradicional
- Funciona em qualquer hospedagem com suporte a Node.js
