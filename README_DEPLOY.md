# Deploy para Hospedagem Node.js

Este projeto está configurado para hospedagem Node.js tradicional e deploy via Docker (Heroku, Railway, DigitalOcean, VPS, etc.).

## Configuração

### Arquivos principais:
- `server.js` - Servidor Express.js
- `start.js` - Arquivo de inicialização
- `routes.js` - Rotas da aplicação
- `package.json` - Dependências e scripts
- `Dockerfile` - Configuração do container Docker
- `.dockerignore` - Arquivos ignorados no build Docker

### Scripts disponíveis:
- `npm start` - Inicia o servidor (produção)
- `npm run dev` - Desenvolvimento com nodemon
- `npm run build` - Prepara arquivos para deploy
- `npm run serve` - Execução simples com Node.js

### Comandos Docker:
- `docker build -t search-generic .` - Construir imagem
- `docker run -p 2500:2500 search-generic` - Executar container

### Variáveis de ambiente:
```bash
PORT=2500  # Porta do servidor (padrão: 2500)
NODE_ENV=production
```

## Deploy em diferentes plataformas:

### 🐳 DigitalOcean App Platform (Docker via GitHub):

#### Pré-requisitos:
1. Conta no DigitalOcean
2. Repositório no GitHub com o código
3. Dockerfile no projeto (já incluído)

#### Passos para deploy:
1. **Acesse o DigitalOcean App Platform:**
   - Vá para [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Clique em "Create App"

2. **Conecte o repositório GitHub:**
   - Selecione "GitHub" como fonte
   - Autorize o acesso ao seu GitHub
   - Escolha o repositório `search_generic`
   - Selecione a branch `main`

3. **Configure o App:**
   - **App Type:** Web Service
   - **Source Directory:** `/` (raiz do projeto)
   - **Build Command:** `docker build -t search-generic .`
   - **Run Command:** `docker run -p 2500:2500 search-generic`
   - **Port:** `2500`

4. **Configurações avançadas:**
   - **Environment Variables:**
     - `NODE_ENV=production`
     - `PORT=2500`
   - **Instance Size:** Basic ($5/mês) ou Professional
   - **Region:** Escolha a mais próxima

5. **Deploy:**
   - Clique em "Create Resources"
   - Aguarde o build e deploy automático
   - Acesse a URL fornecida

#### Monitoramento:
- Logs disponíveis na dashboard do DigitalOcean
- Deploy automático a cada push para a branch main
- Rollback fácil através da interface

### Heroku:
1. `git push heroku main`
2. Configurar variável `NODE_ENV=production`

### Railway:
1. Conectar repositório GitHub
2. Deploy automático

### VPS/Servidor próprio (Docker):
1. `git clone <repo>`
2. `docker build -t search-generic .`
3. `docker run -d -p 2500:2500 --name search-generic search-generic`

### VPS/Servidor próprio (Node.js):
1. `git clone <repo>`
2. `npm install`
3. `npm start`

## Estrutura de arquivos:
```
search_generic/
├── Dockerfile              # Configuração do container
├── .dockerignore           # Arquivos ignorados no Docker
├── server.js               # Servidor Express.js
├── start.js                # Arquivo de inicialização
├── routes.js               # Rotas da aplicação
├── package.json            # Dependências e scripts
├── src/                    # Dados JSON
│   ├── data.json
│   ├── cf.json
│   └── cc.json
├── views/                  # Templates EJS
│   └── index.ejs
└── public/                 # Arquivos estáticos
    ├── css/
    └── script/
```

## Rotas disponíveis:
- `/` - Redireciona para `/ctb`
- `/ctb` - Código de Trânsito Brasileiro
- `/cf` - Código Florestal
- `/ccb` - Código Civil Brasileiro

## Notas:
- Configuração simplificada para Node.js tradicional e Docker
- Funciona em qualquer hospedagem com suporte a Node.js ou Docker
- Usa PM2 para gerenciamento de processos em produção
- Deploy automático via GitHub no DigitalOcean App Platform
- Container otimizado com Node.js Alpine para menor tamanho

## Troubleshooting:

### Problemas comuns no DigitalOcean:
1. **Build falha:** Verifique se o Dockerfile está na raiz do projeto
2. **App não inicia:** Confirme se a porta está configurada como 2500
3. **Deploy não atualiza:** Verifique se fez push para a branch main

### Comandos úteis para debug:
```bash
# Testar localmente com Docker
docker build -t search-generic .
docker run -p 2500:2500 search-generic

# Verificar logs do container
docker logs <container_id>

# Testar sem Docker
npm install
npm start
```
