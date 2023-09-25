var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var filmsRouter = require('./routes/films');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Création d'un objet vide pour stocker les informations de comptage des requêtes
const tableInfo = {};

// Middleware pour récupérer des informations sur les requêtes et les compter
app.use((req, res, next) => {
    // Crée une clé unique en combinant la méthode HTTP et le chemin de la requête
    const info = `${req.method} ${req.path}`;
    
    // Récupère le compteur actuel pour cette clé d'information
    const count = tableInfo[info];

    // Si le compteur n'existe pas (undefined), initialise-le à 0
    if (count === undefined) {
        tableInfo[info] = 0;
    }

    // Incrémente le compteur pour cette clé d'information
    tableInfo[info] += 1;

    // Crée un message de statistiques affichant les compteurs de requêtes pour chaque clé
    const statsMessage = `Compteur de requêtes : \n${Object.keys(tableInfo)
        .map((operation) => `- ${operation} : ${tableInfo[operation]}`)
        .join('\n')}
          `;
          /*
1) Object.keys(tableInfo): Cela prend l'objet tableInfo et utilise la méthode Object.keys() pour obtenir un tableau contenant toutes les clés (noms de propriétés) de cet objet. Dans le contexte de votre code, ces clés représentent des informations sur les requêtes, telles que la méthode HTTP et le chemin de la requête.
2) .map((operation) => - ${operation} : ${tableInfo[operation]}): La méthode mapest utilisée pour itérer sur le tableau de clés obtenu précédemment. Pour chaque clé (qui est représentée ici par la variableoperation), une chaîne de caractères est créée. Cette chaîne est au format - ${operation} : ${tableInfo[operation]}`, où :
- ${operation} : C'est la clé elle-même, généralement au format "MÉTHODE_HTTP CHEMIN_DE_REQUÊTE" (par exemple, "GET /users").
: ${tableInfo[operation]} : Cela ajoute le compteur de requêtes associé à cette clé. La valeur de ce compteur est extraite de l'objet tableInfo en utilisant la clé (tableInfo[operation]).
          */

    // Affiche le message de statistiques dans la console
    console.log(statsMessage);

    // Passe au middleware suivant
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/films', filmsRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
