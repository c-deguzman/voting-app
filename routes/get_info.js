module.exports = {
  
  get_polls (app){

    app.post('/get_polls', function(request, response) {
      
      var MongoClient = require('mongodb').MongoClient;

      MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
        if (err){
          throw err;
          return;
        }

        db.collection("polls", function (err, collection){

          if (err){
            throw err;
            return;
          } 

          collection.find({}).toArray(function (err, documents) {

            if (err){
              throw err;
              return;
            }
            response.send(documents);

          });   
        });
      });
    });
  },
  
  get_auth (app){
    app.post('/get_auth', function(request, response) {
      response.send(request.isAuthenticated());
    });
  },
  
  get_user(app){
    app.post('/get_user', function(request, response){
      response.send(request.user);
    });
  }

}