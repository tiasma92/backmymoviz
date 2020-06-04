var express = require('express');
var router = express.Router();
var mongoose = require('../models/bdd');
var movieModel = require("../models/movies")
let request = require('async-request'),
    response;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/movies',async function(req, res, next) {
  var data = await request("https://api.themoviedb.org/3/discover/movie?api_key=4539dc50f70900d68b8c1a25646d1380")
      body = JSON.parse(data.body);
      console.log(body)
      res.json({result: true,body});
});

router.get('/mymovies', function(req, res, next) {
  movieModel.find(
    function (error, movies) {
       if(error){
         console.log("Oups...error ->", error)
       }else{
         console.log("Here is our new Liked movie ->", movies)
         res.json({result:true,data:movies});
       }
    }
  );
});

router.post('/mymovies', function(req, res, next) {
  var newMovie = new movieModel ({
    poster_path: req.body.poster_path,
    overview: req.body.overview,
    title: req.body.title,
    idMovieDB: req.body.idMovieDB,
  });
  console.log(newMovie)
  newMovie.save(
    function (error, movie) {
       if(error){
         console.log("Oups...error ->", error)
       }else{
         console.log("Here is our new Liked movie ->", movie)
         res.json({result: true,movie});
       }
    }
  );
});
router.delete('/mymovies/:movieId',function(req,res,next){
console.log(req.params.movieId)
  // We will delete in our databse the movie
  movieModel.deleteOne(
    { idMovieDB: req.params.movieId}, 
    function(error,movie) {

        if(error){
          console.log("Oups...error ->", error)
        }else{

          console.log("Here is our deleted movie ->", movie)

          res.json({result: true,movie});
        }
    })
})
module.exports = router;
