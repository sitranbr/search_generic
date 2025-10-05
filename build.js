const fs = require('fs');
const path = require('path');

// Função para copiar diretório recursivamente
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Função para copiar arquivo
function copyFile(src, dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
}

// Função principal de build
function build() {
    console.log('Iniciando build...');
    
    // Criar diretório dist
    const distDir = 'dist';
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true });
    }
    fs.mkdirSync(distDir);
    
    // Copiar diretórios
    console.log('Copiando public...');
    copyDir('public', path.join(distDir, 'public'));
    
    console.log('Copiando views...');
    copyDir('views', path.join(distDir, 'views'));
    
    console.log('Copiando src...');
    copyDir('src', path.join(distDir, 'src'));
    
    console.log('Copiando script...');
    copyDir('script', path.join(distDir, 'script'));
    
    // Arquivos copiados para hospedagem Node.js tradicional
    
    // Copiar arquivos JS
    const jsFiles = [
        'server.js',
        'routes.js',
        'start.js',
        'viewConfig.js',
        'ContentRenderer.js',
        'Utils.js'
    ];
    
    console.log('Copiando arquivos JS...');
    jsFiles.forEach(file => {
        if (fs.existsSync(file)) {
            copyFile(file, path.join(distDir, file));
        }
    });
    
    console.log('Build concluído!');
}

build();
