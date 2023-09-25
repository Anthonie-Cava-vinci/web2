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





module.exports = router;