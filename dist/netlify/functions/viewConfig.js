// viewConfig.js
const express = require('express'); 
const path = require('path');

module.exports = function(app) {
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos de public
};
