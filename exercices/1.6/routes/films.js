var express = require('express');
var router = express.Router();

const films = [
    {
        id:1,
        title:"50 shades of grey",
        duration:118,
        budget:9.99,
        link: "https://www.imdb.com/title/tt2322441/"
    },

    {
        id:2,
        title:"Insidious the red door",
        duration:60,
        budget:13.99,
        link: "https://www.allocine.fr/film/fichefilm_gen_cfilm=182603.html"
    },

    {
        id:3,
        title:"Ant-Man & Wasp",
        duration:118,
        budget:19.99,
        link: "https://www.imdb.com/title/tt10954600/"
    }

]

// Read all the films, filtered by minimum-duration if the query param exists
router.get('/', (req, res) => {
    // Extraction du paramètre 'minimum-duration' de la requête en tant que nombre
    const minimumFilmDuration = Number(req.query['minimum-duration']);
  
    if(typeof minimumFilmDuration !== 'number' || minimumFilmDuration <=0){
      return res.sendStatus(400);
    }

    if(!minimumFilmDuration){
      return res.json(films);
    }
  
    // Filtrage des films pour ne garder que ceux dont la durée est supérieure ou égale à 'minimumFilmDuration'
    const filmsReachingMinimumDuration = films.filter(
      (film) => film.duration >= minimumFilmDuration
    );
  
    // Envoi de la liste filtrée en réponse à la requête
    res.json(filmsReachingMinimumDuration);
  });
  

//Read the films identified by id
router.get('/:id', (req, res) =>{
    console.log(`GET /films/${req.params.id}`);

    const filmsIndex = films.findIndex((film) => film.id == req.params.id);

    if(filmsIndex < 0)
    return res.sendStatus(404);

    res.json(films[filmsIndex]);
});

//Create a film
router.post('/',(req,res)=>{
  const title = req?.body?.title?.trim()?.length !== 0 ? req.body.title : undefined;
  const duration = typeof req?.body?.duration !== 'number' ? undefined : req.body.duration;
  const budget = typeof req?.body?.budget !== 'number' ? undefined : req.body.budget;
  const link = req?.body?.link?.trim()?.length !== 0 ? req.body.link : undefined;

  console.log('POST /films');
  if (!title || !link || !duration || !budget) return res.sendStatus(400);

  const findFilm = films.find((films) => films.title.toLocaleLowerCase() === title.toLocaleLowerCase());

  if(findFilm){
    return res.sendStatus(400);
  }

  const lastItemIndex = films?.length !== 0 ? films.length - 1 : undefined;
  const lastId = lastItemIndex !== undefined ? films[lastItemIndex]?.id : 0;
  const nextId = lastId + 1;


  const filmsCreated = {
    id : nextId, title,duration,budget,link
  }
  films.push(filmsCreated);
  return res.json(filmsCreated);
})



// Suppression d'un film par ID en utilisant la méthode DELETE.
router.delete('/:id', (req, res) => {
  // Trouver l'index du film à supprimer dans le tableau 'films' en fonction de l'ID passé dans les paramètres de la requête.
  const indexFilm = films.findIndex((film) => film.id == req.params.id);

  // Si l'indexFilm est -1, cela signifie que le film n'a pas été trouvé.
  if (indexFilm === -1) {
    return res.sendStatus(404);
  }

  // Utilisez la méthode 'splice' pour supprimer le film trouvé à l'index correspondant.
  // La méthode splice met l'éléments supprimer en 1er.
  const removedFilms = films.splice(indexFilm, 1);

  // Le film supprimé est le premier (et unique) élément du tableau 'removedFilms'.
  const filmRemoved = removedFilms[0];

  // Répondre avec le film supprimé au format JSON.
  return res.json(filmRemoved);
});

// Définition d'une route pour effectuer des mises à jour partielles d'un film par ID en utilisant la méthode PATCH.
router.patch('/:id', (req, res) => {
  // Extraction des champs du corps de la requête (s'ils existent).
  const title = req?.body?.title;
  const duration = req?.body?.duration;
  const budget = req?.body?.budget;
  const link = req?.body?.link;

  // Vérification de la validité des données reçues dans le corps de la requête.
  if (!req.body || 
    (title !== undefined && !title.trim()) || // Vérifie si 'title' est une chaîne vide ou indéfinie.
    (link !== undefined && !link.trim()) ||   // Vérifie si 'link' est une chaîne vide ou indéfinie.
    (duration !== undefined && (typeof req?.body?.duration !== 'number' || duration < 0)) || // Vérifie si 'duration' est un nombre valide et positif.
    (budget !== undefined && (typeof req?.body?.budget !== 'number' || budget < 0))          // Vérifie si 'budget' est un nombre valide et positif.
  )
    return res.sendStatus(400); // Renvoie une réponse de statut 400 (Bad Request) si les données sont invalides.

  // Recherche de l'index du film à mettre à jour dans le tableau 'films' en fonction de l'ID passé dans les paramètres de la requête.
  const indexOfFilmFound = films.findIndex((film) => film.id == req.params.id);

  // Récupération du film à mettre à jour.
  const filmToChange = films[indexOfFilmFound];

  // Récupération des modifications à appliquer à ce film à partir du corps de la requête.
  const changesToApply = req.body;

  // Création d'un nouveau film avec les modifications appliquées.
  const updatedFilm = {
    ...filmToChange,
    ...changesToApply
  };

  // Remplacement de l'ancien film par le nouveau film dans le tableau 'films'.
  films[indexOfFilmFound] = updatedFilm;

  // Réponse JSON renvoyant le film mis à jour.
  return res.json(updatedFilm);
});

// Mettre à jour un film uniquement si toutes les propriétés sont fournies, ou le créer s'il n'existe pas encore et que l'ID est inexistant.
router.put('/:id', function (req, res) {
  // Extraction des champs du corps de la requête.
  const title = req?.body?.title;
  const link = req?.body?.link;
  const duration = req?.body?.duration;
  const budget = req?.body?.budget;

  // Vérification de la validité des données reçues dans le corps de la requête.
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
    return res.sendStatus(400); // Renvoie une réponse de statut 400 (Bad Request) si les données sont invalides.

  // Récupération de l'ID du film à mettre à jour à partir des paramètres de la requête.
  const id = req.params.id;

  // Recherche de l'index du film dans le tableau 'films' en fonction de l'ID.
  const indexOfFilmFound = films.findIndex((film) => film.id == id);

  // Si l'ID n'est pas trouvé, créez un nouveau film.
  if (indexOfFilmFound < 0) {
    const newFilm = { id, title, link, duration, budget };
    films.push(newFilm);
    return res.json(newFilm);
  }

  // Si l'ID est trouvé, mettez à jour le film existant.
  const filmPriorToChange = films[indexOfFilmFound];
  const objectContainingPropertiesToBeUpdated = req.body;

  const updatedFilm = {
    ...filmPriorToChange,
    ...objectContainingPropertiesToBeUpdated,
  };

  films[indexOfFilmFound] = updatedFilm;

  // Réponse JSON renvoyant le film mis à jour.
  return res.json(updatedFilm);
});



module.exports = router;