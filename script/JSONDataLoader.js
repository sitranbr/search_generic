// JSONDataLoader.js
const fs = require('fs').promises;

class JSONDataLoader {
  /**
   * Carrega o conteúdo de um arquivo JSON.
   * @param {string} filePath - O caminho para o arquivo JSON.
   * @returns {Promise<Object>} - Os dados do JSON.
   */
  static async load(filePath) {
    try {
      const dataStr = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(dataStr);
    } catch (error) {
      console.error('Error loading JSON file:', error);
      throw error;
    }
  }
}

module.exports = JSONDataLoader;
