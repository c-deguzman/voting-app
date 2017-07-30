require('dotenv').config()

var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var bodyParser = require('body-parser');

const passport = require('passport')  
const session = require('express-session')  
const RedisStore = require('connect-redis')(session)

var login = require('./routes/login.js');
var register = require("./routes/register.js");
var get_info = require("./routes/get_info.js");
var make_poll = require("./routes/make_poll.js");

var flash = require("connect-flash");
var cookieParser = require('cookie-parser')

var React = require('react');
var ReactDOM = require('react-dom/server');

require('babel-core/register');
//require('babel-polyfill');

var cors = require("cors");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var app = express();
var compiler = webpack(config);

require('./authentication').init(app);

app.use(cookieParser());
app.use(flash());


app.use(cors({origin: "https://voting-app-gamma.herokuapp.com/"}));


app.use(session({  
  store: new RedisStore({
    url: process.env.REDIS
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 }
}));

app.use(passport.initialize())  
app.use(passport.session()) 

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  noInfo: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
})); 

app.enable('trust proxy');

login(app);
register(app);
get_info.get_polls(app);
get_info.get_auth(app);
get_info.get_user(app);
get_info.get_poll(app);
get_info.vote(app);
get_info.add_option(app);
get_info.get_my_polls(app);
get_info.delete_poll(app);
make_poll(app);



app.use(function(request, response, next){

  console.log(request.path);

  if ((request.isAuthenticated() && request.path == "/login") ||
      (request.isAuthenticated() && request.path == "/login/") || 
      (request.isAuthenticated() && request.path == "/register") ||  
      (request.isAuthenticated() && request.path == "/register/")) {
      response.redirect('/home');
    } else {
      return next();
    }
  
});





app.get('/', function (request, response){
    response.redirect('/home/');
});



app.get('/logout', function (request, response){
  request.session.destroy(function (err) {
    response.redirect('/login/');
  });
});


app.get('/login', function(request, response) {
  //response.sendFile(path.join(__dirname, '/views/login_index.html'));
  var Login_App = require("./src/Login.js").default;
  var Login_html = require("./src/login_template").default;
  
  var Comp_Fact = React.createFactory(Login_App);
  const Login_string = ReactDOM.renderToString(Comp_Fact());
  
  response.send(Login_html({
    body: Login_string,
    title: "Voting App"
  }));
});

app.get('/register', function(request, response) {
  var Register_App = require("./src/Register.js").default;
  var Register_html = require("./src/register_template").default;
  
  var Comp_Fact = React.createFactory(Register_App);
  const Register_string = ReactDOM.renderToString(Comp_Fact());
  
  response.send(Register_html({
    body: Register_string,
    title: "Voter Registration"
  }));
});

app.get('/home', function(request, response) {
  var Home_App = require("./src/Home.js").default;
  var Home_html = require("./src/home_template").default;

  var Comp_Fact = React.createFactory(Home_App);
  const Home_string = ReactDOM.renderToString(Comp_Fact());
  
  response.send(Home_html({
    body: Home_string,
    title: "Home Page"
  }));
});

app.get('/my_polls', function(request, response) {
  var MyPolls_App = require("./src/MyPolls.js").default;
  var MyPolls_html = require("./src/myPolls_template").default;

  var Comp_Fact = React.createFactory(MyPolls_App);
  const MyPolls_string = ReactDOM.renderToString(Comp_Fact());
  
  response.send(MyPolls_html({
    body: MyPolls_string,
    title: "My Polls"
  }));
});


app.get('/create_poll', function(request, response) {
  var CreatePoll_App = require("./src/CreatePoll.js").default;
  var CreatePoll_html = require("./src/createPoll_template").default;

  var Comp_Fact = React.createFactory(CreatePoll_App);
  const CreatePoll_string = ReactDOM.renderToString(Comp_Fact());
  
  response.send(CreatePoll_html({
    body: CreatePoll_string,
    title: "Create Poll"
  }));
});

app.get('/poll', function(request, response) {

  var ChartDisplay_App = require("./src/ChartDisplay.js").default;
  var ChartDisplay_html = require("./src/chartDisplay_template").default;

  var Comp_Fact = React.createFactory(ChartDisplay_App);
  const ChartDisplay_string = ReactDOM.renderToString(Comp_Fact());
  
  response.send(ChartDisplay_html({
    body: ChartDisplay_string,
    title: "Poll Results"
  }));
});

//app.listen(3000, '0.0.0.0', function(err) {
app.listen(process.env.PORT || 3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3000/');
});


function safeStringify(obj) {
  return JSON.stringify(obj)
    .replace(/<\/(script)/ig, '<\\/$1')
    .replace(/<!--/g, '<\\!--')
    .replace(/\u2028/g, '\\u2028') 
    .replace(/\u2029/g, '\\u2029');
}
