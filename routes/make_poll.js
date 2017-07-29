module.exports = function(app){
  
  app.post('/make_poll', function(request, response) {  

    if (!request.isAuthenticated()){
      response.send({"result" : "error",
                     "error": "You are not signed in."});
    }



    var quit_call = false;
    var options = request.body.options;

    var sorted_options = options.slice().sort();

    for (var i in sorted_options){
      if (i > 0){
        if (sorted_options[i] == sorted_options[i - 1]){
          quit_call = true;
        }
      }
    }

    if (quit_call){
      response.send({"result" : "error",
                          "error": "Options should not contain duplicates."});
    }

    if (!quit_call){

      var MongoClient = require('mongodb').MongoClient;
      
      var username = request.user;
      var title = request.body.title;
      
      
      var time = Math.round(new Date().getTime()/1000);
      
      var votes = Array.apply(null, Array(options.length)).map(Number.prototype.valueOf,0);

      var doc = {
                  poster: username,
                  title: title,
                  options: options,
                  time: time,
                  votes: votes,
                  voted_list: [],
                  total_votes: 0
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
                response.send({"result": "error",
                               "error" : "Already a poll with the same name."});
              } else {
                  
                collection.insert(doc, function(err, records){

                  if(err){
                    throw err;
                  }

                  response.send({ "result": "success",
                                  "redir": records.ops[0]._id });


                }); 
              }
            });
          });        
        });
    }
  });

}
