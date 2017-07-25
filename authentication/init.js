const passport = require('passport')  
const LocalStrategy = require('passport-local').Strategy

var MongoClient = require('mongodb').MongoClient;


function findUser(username, callback){

  MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
    if (err){
      throw err;
      return callback(err);
    }

    db.collection("accounts", function (err, collection){

      if (err){
        throw err;
        return callback(err);
      }

      collection.findOne({"user": username}, function (err, result){

        db.close();

        if (err) {
          return callback(err);
        }
        
        return callback(null, result);
      
      });
    });
  });
}

passport.serializeUser(function(user, done) {
  done(null, user.user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


function initPassport () {
  passport.use(new LocalStrategy(
    {usernameField:"user", passwordField:"pass"},
    function(username, password, done) {
      findUser(username, function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, { message: 'Invalid username' })
        }
        if (password !== user.pass ) {
          return done(null, false, { message: 'Incorrect password' })
        }
        return done(null, user)
      })
    }
  ))
}

module.exports = initPassport