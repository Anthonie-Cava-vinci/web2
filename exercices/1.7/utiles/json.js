// Importer le module 'fs' (système de fichiers) de Node.js
const fs = require('fs');

/**
 * Fonction pour analyser le contenu d'un fichier .json
 * @param {String} filePath - chemin du fichier .json
 * Si le fichier n'existe pas ou si son contenu ne peut pas être analysé en tant que données JSON,
 * utilisez les données par défaut.
 * @param {Array} defaultArray - Contenu à utiliser lorsque le fichier .json n'existe pas
 * @returns {Array} : le tableau qui a été analysé à partir du fichier (ou defaultArray)
 */
function parse(filePath, defaultArray = []) {
  // Vérifie si le fichier existe
  if (!fs.existsSync(filePath)) return defaultArray;

  // Lit le contenu du fichier synchroniquement
  const fileData = fs.readFileSync(filePath);

  try {
    // Tente de convertir le contenu du fichier en objet JavaScript (JSON)
    // Lance une exception SyntaxError si la chaîne à analyser n'est pas un JSON valide.
    return JSON.parse(fileData);
  } catch (err) {
    // En cas d'erreur, renvoie le tableau par défaut
    return defaultArray;
  }
}

/**
 * Fonction pour sérialiser le contenu d'un objet dans un fichier
 * @param {String} filePath - chemin du fichier .json
 * @param {Array} object - Objet à écrire dans le fichier .json.
 * Même si le fichier existe, son contenu entier est remplacé par l'objet donné.
 */
function serialize(filePath, object) {
  // Convertit l'objet en une chaîne JSON
  const objectSerialized = JSON.stringify(object);

  // Crée le répertoire parent du fichier si nécessaire
  createPotentialLastDirectory(filePath);

  // Écrit la chaîne JSON dans le fichier
  fs.writeFileSync(filePath, objectSerialized);
}

/**
 * Crée le répertoire parent potentiel du fichier
 * @param {String} filePath - chemin du fichier .json
 */
function createPotentialLastDirectory(filePath) {
  // Obtient le chemin du répertoire parent
  const pathToLastDirectory = filePath.substring(0, filePath.lastIndexOf('/'));

  // Vérifie si le répertoire parent existe
  if (fs.existsSync(pathToLastDirectory)) return;

  // Crée le répertoire parent s'il n'existe pas
  fs.mkdirSync(pathToLastDirectory);
}

// Exporte les fonctions 'parse' et 'serialize' pour les rendre accessibles depuis d'autres fichiers
module.exports = { parse, serialize };
