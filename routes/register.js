module.exports = function(app){
  
  app.post('/register', function(request, response) {    
    var forwardedIpsStr = request.header('x-forwarded-for');
     var IP = 'localhost';

     if (forwardedIpsStr) {
        IP = forwardedIpsStr.split(',')[0];  
     }
    
    
    var MongoClient = require('mongodb').MongoClient;
    
    var username = request.body.user;
    var password = request.body.pass;
    
    var document = {user: username,
                    pass: password,
                    ip: IP};

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

        collection.findOne({"user": username}, function (err, result){
          if (err){
            throw err;
            return;
          }
          
          if (result){
            response.status(200).send({"result": "error",
                           "error" : "Username already taken."});
          } else {
            
            collection.findOne({"ip": IP}, function (err, result){
              if (err){
                throw err;
                return;
              }

              if (result){
                response.status(200).send({"result": "error",
                                "error" : "One account per person please."});
              } else {
                
                collection.insert(document, function(err, records){
                  
                  if(err){
                    throw err;
                  }
                  
                  response.status(200).send({"result": "success"});
                }); 
              }
            });
          }
        });        
      });
    });
  });
}
