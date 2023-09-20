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

// Read all the pizzas from the menu
router.get('/', (req, res, next) => {
    console.log('GET /films');
    res.json(FILMS);
  });

  module.exports = router;