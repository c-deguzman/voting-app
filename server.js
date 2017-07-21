var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var bodyParser = require('body-parser');

var login = require('./routes/login.js');

var app = express();
var compiler = webpack(config);

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
})); 

login(app);

app.get('/', function(request, response) {
  response.redirect("https://voting-app-gamma.glitch.me/login");
});

app.get('/login', function(request, response) {
  response.sendFile(path.join(__dirname, '/views/login_index.html'));
});

app.listen(3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3000/');
});
