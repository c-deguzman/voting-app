module.exports = function(app){
  
  app.post('/make_poll', function(request, response) {  

    if (!request.isAuthenticated()){
      response.send({"result" : "error",
                     "error": "You are not signed in."});
    }


    var MongoClient = require('mongodb').MongoClient;
    
    var username = request.user;
    var title = request.body.title;
    var options = request.body.options;
    
    var time = Math.round(new Date().getTime()/1000);
    
    var votes = Array.apply(null, Array(options.length)).map(Number.prototype.valueOf,0);



    var sorted_options = options.slice().sort();

    for (var i in sorted_options){
      if (i > 0){
        if (sorted_options[i] == sorted_options[i - 1]){
          response.send({"result" : "error",
                          "error": "Options should not contain duplicates."});
        }
      }
    }

    
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

              response.status(200).send({
                "result": "success",
                "redirect": records.ops[0]._id });
            }); 
          }
        });
      });        
    });
  });
}
