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

          collection.find({}, {"sort" : [['time', 'descending']]}).toArray(function (err, documents) {

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
      if (!request.isAuthenticated()){
        response.send(false);
      }
      
      response.send(request.user);
    });
  },
  
  get_poll(app){
    app.post('/poll', function(request, response){
      
      var MongoClient = require('mongodb').MongoClient;
      
      var poll_id = request.body.id;
      
      var o_id = new require('mongodb').ObjectID(poll_id);
      
      
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

          collection.findOne({"_id": o_id}, function (err, result){
            if (err){
              throw err;
              return;
            }

            if (result){

              var chart_data = [["Option", "Votes"]];

              for (var i in result.options){
                chart_data.push([result.options[i], result.votes[i]]);
              }


              response.status(200).send({ result: "success",
                                          poster: result.poster,
                                          chart_data: chart_data,
                                          title: result.title });
            } else {
              response.status(200).send({result: "error",
                                         error: "Poll not found."});
            }
          });
        });
      });  
    });
  }
  
  

}