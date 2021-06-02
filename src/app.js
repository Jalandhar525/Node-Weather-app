const path = require('path');
const express = require('express');
const hbs = require('hbs');
const request = require('request');

const app = express();
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates');

app.use(express.static(publicDirectoryPath));
app.set('view engine', 'hbs');
app.set('views', viewsPath);

const partialsPath = path.join(__dirname, '../templates/partials');
hbs.registerPartials(partialsPath);

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Jalandhar',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About page',
    name: 'Jalandhar',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help page',
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address',
    });
  }
  const geoCodeUrl =
    'https://nominatim.geocoding.ai/search.php?q=' +
    req.query.address +
    '&format=jsonv2';

  request({ url: geoCodeUrl, json: true }, (error, resp) => {
    const url =
      'http://www.7timer.info/bin/api.pl?lon=' +
      resp.body[0].lon +
      '&lat=' +
      resp.body[0].lat +
      '&product=civillight&output=json';

    request({ url: url, json: true }, (error, response) => {
      res.send({
        location: resp.body[0].display_name,
        address: req.query.address,
        forecast: response.body.dataseries[0].weather,
        max_temp: response.body.dataseries[0].temp2m.max,
      });
    });
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    errorMsg: 'Help Article Not Found',
  });
});
app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    errorMsg: 'Page not Found',
  });
});

app.listen(port, () => {
  console.log('Server Up and Running');
});
