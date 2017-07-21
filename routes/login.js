module.exports = function(app){
  
  var MongoClient = require('mongodb').MongoClient;
  
  app.post("/login",function (request, response) {
    
    var user = request.body.user;
    var pass = request.body.pass;
    
    if (!user || !pass){
      response.json({"error": "Invalid Login Credentials"});
      return;
    }
    
    MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
      if (err){
        throw err;
        return;
      }
      
      db.collection("accounts", function (err, collection){
        
        if (err){
          throw err;
          return;
        }
        
        collection.findOne({"user": user, "pass": pass}, function (err, result){
          
          db.close();
          if (result){
            response.send({"login" : "successful"});
          } else {
            response.send({"login" : "failed"});
          }
          return;
        });
      });
    });
  });
}
