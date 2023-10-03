// Importer le module 'express' pour créer un routeur
var express = require('express');
// Créer un routeur Express
var router = express.Router();

// Définition d'un tableau de films
const films = [
    {
        id: 1,
        title: "50 shades of grey",
        duration: 118,
        budget: 9.99,
        link: "https://www.imdb.com/title/tt2322441/"
    },
    {
        id: 2,
        title: "Insidious the red door",
        duration: 60,
        budget: 13.99,
        link: "https://www.allocine.fr/film/fichefilm_gen_cfilm=182603.html"
    },
    {
        id: 3,
        title: "Ant-Man & Wasp",
        duration: 118,
        budget: 19.99,
        link: "https://www.imdb.com/title/tt10954600/"
    }
]

// Route pour lire tous les films, filtrés par 'minimum-duration' s'il existe dans les paramètres de la requête
router.get('/', (req, res) => {
    // Extraction du paramètre 'minimum-duration' de la requête en tant que nombre
    const minimumFilmDuration = Number(req.query['minimum-duration']);

    // Vérification si 'minimumFilmDuration' est un nombre positif valide
    if (typeof minimumFilmDuration !== 'number' || minimumFilmDuration <= 0) {
        return res.sendStatus(400); // Répondre avec un code d'état 400 (Bad Request) si invalide
    }

    // Filtrer les films dont la durée est supérieure ou égale à 'minimumFilmDuration'
    const filmsReachingMinimumDuration = films.filter(
        (film) => film.duration >= minimumFilmDuration
    );

    // Répondre avec la liste filtrée de films
    res.json(filmsReachingMinimumDuration);
});

// Route pour lire un film par son ID
router.get('/:id', (req, res) => {
    console.log(`GET /films/${req.params.id}`);

    // Rechercher l'index du film dans le tableau 'films' en fonction de l'ID fourni
    const filmsIndex = films.findIndex((film) => film.id == req.params.id);

    // Si l'ID n'est pas trouvé, répondre avec un code d'état 404 (Not Found)
    if (filmsIndex < 0)
        return res.sendStatus(404);

    // Répondre avec le film correspondant à l'ID
    res.json(films[filmsIndex]);
});

// Route pour créer un nouveau film
router.post('/', (req, res) => {
    // Extraire les données du corps de la requête
    const title = req?.body?.title?.trim()?.length !== 0 ? req.body.title : undefined;
    const duration = typeof req?.body?.duration !== 'number' ? undefined : req.body.duration;
    const budget = typeof req?.body?.budget !== 'number' ? undefined : req.body.budget;
    const link = req?.body?.link?.trim()?.length !== 0 ? req.body.link : undefined;

    // Vérifier si toutes les données requises sont fournies
    if (!title || !link || !duration || !budget) {
        return res.sendStatus(400); // Répondre avec un code d'état 400 (Bad Request) si des données manquantes
    }

    // Ajouter le nouveau film au tableau 'films'
    // NOTE: Vous devez avoir une fonction `parse` et `serialize` pour gérer la persistance des données.
    const films = parse(jsonDbPath, defaultFilms);
    const findFilm = films.find((film) => film.title.toLocaleLowerCase() === title.toLocaleLowerCase());

    // Vérifier si un film avec le même titre existe déjà
    if (findFilm) {
        return res.sendStatus(400); // Répondre avec un code d'état 400 (Bad Request) si un film avec le même titre existe déjà
    }

    // Calculer le prochain ID pour le nouveau film
    const lastItemIndex = films?.length !== 0 ? films.length - 1 : undefined;
    const lastId = lastItemIndex !== undefined ? films[lastItemIndex]?.id : 0;
    const nextId = lastId + 1;

    // Créer un nouvel objet de film
    const filmCreated = {
        id: nextId,
        title,
        duration,
        budget,
        link
    };

    // Ajouter le film au tableau 'films'
    films.push(filmCreated);

    // Sauvegarder les données dans le fichier JSON
    serialize(jsonDbPath, films);

    // Répondre avec le film créé au format JSON
    return res.json(filmCreated);
});

// Route pour supprimer un film par son ID
router.delete('/:id', (req, res) => {
    // Rechercher l'index du film dans le tableau 'films' en fonction de l'ID fourni
    const indexFilm = films.findIndex((film) => film.id == req.params.id);

    // Si l'ID n'est pas trouvé, répondre avec un code d'état 404 (Not Found)
    if (indexFilm === -1) {
        return res.sendStatus(404);
    }

    // Supprimer le film du tableau 'films'
    const removedFilms = films.splice(indexFilm, 1);
    const filmRemoved = removedFilms[0];

    // Sauvegarder les données dans le fichier JSON
    serialize(jsonDbPath, films);

    // Répondre avec le film supprimé au format JSON
    return res.json(filmRemoved);
});

// Route pour effectuer des mises à jour partielles d'un film par ID en utilisant la méthode PATCH
router.patch('/:id', (req, res) => {
    // Extraire les champs du corps de la requête (s'ils existent)
    const title = req?.body?.title;
    const duration = req?.body?.duration;
    const budget = req?.body?.budget;
    const link = req?.body?.link;

    // Vérifier la validité des données reçues dans le corps de la requête
    if (!req.body ||
        (title !== undefined && !title.trim()) ||
        (link !== undefined && !link.trim()) ||
        (duration !== undefined && (typeof req?.body?.duration !== 'number' || duration < 0)) ||
        (budget !== undefined && (typeof req?.body?.budget !== 'number' || budget < 0))
    )
        return res.sendStatus(400); // Répondre avec un code d'état 400 (Bad Request) si les données sont invalides

    // Rechercher l'index du film à mettre à jour dans le tableau 'films' en fonction de l'ID fourni
    const indexOfFilmFound = films.findIndex((film) => film.id == req.params.id);

    // Récupérer le film à mettre à jour
    const filmToChange = films[indexOfFilmFound];

    // Récupérer les modifications à appliquer à ce film à partir du corps de la requête
    const changesToApply = req.body;

    // Créer un nouveau film avec les modifications appliquées
    const updatedFilm = {
        ...filmToChange,
        ...changesToApply
    };

    // Remplacer l'ancien film par le nouveau film dans le tableau 'films'
    films[indexOfFilmFound] = updatedFilm;

    // Sauvegarder les données dans le fichier JSON
    serialize(jsonDbPath, films);

    // Répondre avec le film mis à jour au format JSON
    return res.json(updatedFilm);
});

// Route pour mettre à jour un film uniquement si toutes les propriétés sont fournies ou le créer s'il n'existe pas encore et que l'ID est inexistant
router.put('/:id', function (req, res) {
    // Extraire les champs du corps de la requête
    const title = req?.body?.title;
    const link = req?.body?.link;
    const duration = req?.body?.duration;
    const budget = req?.body?.budget;

    // Vérifier la validité des données reçues dans le corps de la requête
    if (
        !req.body ||
        !title ||
        !title.trim() ||
        !link ||
        !link.trim() ||
        duration === undefined ||
        typeof req?.body?.duration !== 'number' ||
        duration < 0 ||
        budget === undefined ||
        typeof req?.body?.budget !== 'number' ||
        budget < 0
    )
        return res.sendStatus(400); // Répondre avec un code d'état 400 (Bad Request) si les données sont invalides

    // Récupérer l'ID du film à mettre à jour à partir des paramètres de la requête
    const id = req.params.id;

    // Rechercher l'index du film dans le tableau 'films' en fonction de l'ID
    const indexOfFilmFound = films.findIndex((film) => film.id == id);

    // Si l'ID n'est pas trouvé, créer un nouveau film
    if (indexOfFilmFound < 0) {
        const newFilm = { id, title, link, duration, budget };
        films.push(newFilm);

        // Sauvegarder les données dans le fichier JSON
        serialize(jsonDbPath, films);

        return res.json(newFilm);
    }

    // Si l'ID est trouvé, mettre à jour le film existant
    const filmPriorToChange = films[indexOfFilmFound];
    const objectContainingPropertiesToBeUpdated = req.body;

    const updatedFilm = {
        ...filmPriorToChange,
        ...objectContainingPropertiesToBeUpdated,
    };

    films[indexOfFilmFound] = updatedFilm;

    // Sauvegarder les données dans le fichier JSON
    serialize(jsonDbPath, films);

    // Répondre avec le film mis à jour au format JSON
    return res.json(updatedFilm);
});

// Exporter le routeur pour être utilisé ailleurs dans l'application
module.exports = router;
