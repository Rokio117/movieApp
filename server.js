require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movies = require('./movies.json');

const app = express();

app.use(morgan('dev'));

app.use(function validateBearerToken(req, res, next) {
  const bearerToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;
  if (bearerToken !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

app.get('/movies', (req, res) => {
  const { genre = '', average = '', vote = '' } = req.query;
  console.log(genre, 'genre');
  let response = movies;
  const keys = Object.keys(req.query);
  function test(keys) {
    if (Object.keys(req.query).length) {
      const genre = keys.map(key => key.includes('genre'));
      const average = keys.map(key => key.includes('average'));
      const vote = keys.map(key => key.includes('vote'));
      //console.log(genre, 'genre', average, 'average', vote, 'vote');
      //console.log(Object.values(genre)[0]);
      if (
        Object.values(genre)[0] === false &&
        Object.values(average)[0] === false &&
        Object.values(vote)[0] === false
      ) {
        return false;
      }
    } else return true;
  }

  if (test(keys)) {
    if (genre) {
      console.log('genre ran');
      //console.log('genre');
      // console.log(genre);
      //console.log(movies, 'movies');
      //console.log(response.map(movie => movie.genre));
      response.filter(movie => {
        return movie.genre.toLowerCase().includes(genre);
      });
      //console.log('response in genre handler', response);
    }
    if (average) {
      //console.log('average');
    }
    if (vote) {
      //console.log('vote');
    }
  }
  if (test(keys) === false) {
    response = 'query must be genre, average, or vote';
  }

  res.send(response);
});

app.listen(8000, () => {
  console.log('server is listening at port 8000');
});
