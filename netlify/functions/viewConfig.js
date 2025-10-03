const express = require('express');
const path = require('path');

module.exports = (app) => {
    // Configuração de views
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../../views'));
    
    // Configuração de arquivos estáticos
    app.use(express.static(path.join(__dirname, '../../public')));
};
