module.exports = function(app){
  
  const passport = require('passport');
  var flash = require('connect-flash');
  
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/home/',
    failureRedirect: '/login/',
    failureFlash: true
  }));
}
