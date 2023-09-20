var express = require('express');
var router = express.Router();

const FILMS = [
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

// Read all the films
router.get('/', (req, res, next) => {
    console.log('GET /films');
    res.json(FILMS);
});

//Read the films identified by id
router.get('/:id', (req, res) =>{
    console.log(`GET /films/${req.params.id}`);

    const filmsIndex = FILMS.findIndex((film) => film.id == req.params.id);

    if(filmsIndex < 0)
    return res.sendStatus(404);

    res.json(FILMS[filmsIndex]);
});

// Read all the films, filtered by minimum-duration if the query param exists
router.get('/', (req, res) => {
    // Extraction du paramètre 'minimum-duration' de la requête en tant que nombre
    const minimumFilmDuration = Number(req.query['minimum-duration']);
  
    // Vérification si 'minimumFilmDuration' n'est pas un nombre valide ou est inférieur ou égal à zéro
    if (isNaN(minimumFilmDuration) || minimumFilmDuration <= 0) {
      // Si la condition est vraie, renvoie un message d'erreur
      return res.json('Wrong minimum duration');
    }
  
    // Filtrage des films pour ne garder que ceux dont la durée est supérieure ou égale à 'minimumFilmDuration'
    const filmsReachingMinimumDuration = films.filter(
      (film) => film.duration >= minimumFilmDuration
    );
  
    // Envoi de la liste filtrée en réponse à la requête
    res.json(filmsReachingMinimumDuration);
  });
  
  


  module.exports = router;