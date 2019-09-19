require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const movies = require('./movies.json');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next) {
  const bearerToken = req.get('Authorization');
  const formatToken = bearerToken.split(' ')[1];

  const apiToken = process.env.API_TOKEN;
  if (formatToken !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

app.get('/movies', (req, res) => {
  const { genre = '', average_vote = '', country = '' } = req.query;
  let response = movies;
  const keys = Object.keys(req.query);
  function test(keys) {
    let result = true;
    if (Object.keys(req.query).length) {
      const thanos = keys.every(
        string =>
          string === 'genre' ||
          string === 'average_vote' ||
          string === 'country'
      );
      console.log('thanos', thanos);

      if (!thanos) {
        result = false;
      }
    }
    return result;
  }
  test(keys);
  console.log(test(keys), 'test');
  if (test(keys)) {
    if (genre) {
      response = response.filter(movie =>
        movie.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }

    if (country) {
      response = response.filter(movie =>
        movie.country.toLowerCase().includes(country.toLowerCase())
      );
    }
    if (average_vote) {
      //console.log(average_vote, 'average_vote');
      if (average_vote > 10) {
        response = 'average vote must be under 10';
      }
      if (average_vote <= 10)
        response = response.filter(movie => movie.avg_vote >= average_vote);
    }
    if (response.length === 0) {
      response = 'sorry, we could not find a search for that';
    }
  }
  if (!test(keys)) {
    response = 'query must be genre, average_vote, or vote';
  }

  res.send(response);
});

app.listen(8000, () => {
  console.log('server is listening at port 8000');
});
