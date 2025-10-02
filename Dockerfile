# Use uma imagem base do Node.js
FROM node:16-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instale as dependências
RUN npm install
RUN npm install -g pm2-runtime

# Copie o restante dos arquivos do projeto
COPY . .

# Exponha a porta que a aplicação vai usar (verifique o arquivo server.js)
EXPOSE 2500

# Comando para iniciar a aplicação
CMD ["pm2-runtime", "start", "start.js"]