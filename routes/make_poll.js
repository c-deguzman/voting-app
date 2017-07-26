module.exports = function(app){
  
  app.post('/make_poll', function(request, response) {    

    var MongoClient = require('mongodb').MongoClient;
    
    var username = request.user;
    var title = request.body.title;
    var options = request.body.options;
    
    var time = Math.round(new Date().getTime()/1000);
    
    var votes = Array.apply(null, Array(options.length)).map(Number.prototype.valueOf,0);
    
    var document = {poster: username,
                    title: title,
                    options: options,
                    time: time,
                    votes: votes,
                    voted_list: []
                    };

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

        collection.findOne({"title": title}, function (err, result){
          if (err){
            throw err;
            return;
          }
          
          if (result){
            response.status(200).send({"result": "error",
                           "error" : "Already a poll with the same name."});
          } else {
              
            collection.insert(document, function(err, records){

              if(err){
                throw err;
              }

              response.status(200).send({"result": "success"});
            }); 
          }
        });
      });        
    });
  });
}
