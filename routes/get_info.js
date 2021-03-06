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

  get_my_polls(app){
    app.post('/get_my_polls', function(request, response) {
      
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

            var send_docs = [];
            var total_res = 0;

            for (var i in documents){
              if (documents[i].poster == request.user){
                send_docs.push(documents[i]);
                total_res += documents[i].total_votes;
              }
            }
            response.send({my_polls: send_docs,
                           my_contr: total_res
                         });
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
  },

  vote(app){
    app.post('/vote', function(request, response){
      
      var MongoClient = require('mongodb').MongoClient;
      
      var poll_id = request.body.id;
      var option = request.body.option;
      
      var o_id = new require('mongodb').ObjectID(poll_id);

      var forwardedIpsStr = request.header('x-forwarded-for');
      var IP = 'localhost';

      if (forwardedIpsStr) {
        IP = forwardedIpsStr.split(',')[0] || request.connection.remoteAddress;  
     } else {
        IP = request.ip || request.connection.remoteAddress;
     }
      
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

              var vote_ind = option;

                if (vote_ind < 0 || vote_ind >= result.options.length){
                  response.status(200).send({"result" : "error",
                                  "error": "Voting option not found"});
                } else if (result.voted_list.indexOf(IP) != -1 || (request.user && result.voted_list.indexOf(request.user) != -1)){
                    response.status(200).send({"result" : "error",
                                  "error": "You have already voted"});
                } else {

                  var new_votes = result.votes;
                  new_votes[vote_ind] += 1;

                  var chart_data = [["Option", "Votes"]];

                  for (var i in result.options){
                    chart_data.push([result.options[i], new_votes[i]]);
                  }

                  var new_voted_list = result.voted_list;
                  new_voted_list.push(IP);

                  if (request.user){
                    new_voted_list.push(request.user);
                  }
                  

                  var new_total_votes = result.total_votes + 1;

                  collection.update({"_id": o_id}, 
                    {$set : {votes: new_votes,
                             voted_list: new_voted_list,
                             total_votes: new_total_votes}}, function (error, result){

                    if (error){
                      response.status(200).send({"result" : "error",
                                  "error": "Error encountered while updating"});
                    }

                    if (result){
                      response.status(200).send({ "result": "success",
                                                  "chart_data": chart_data});
                    } else {
                      response.status(200).send({"result" : "error",
                                  "error": "Error encountered while updating"});
                    }
                  }); 

                }
              }

          });
        });
      });  
       
    });
  },

  add_option(app){
    app.post("/add_option", function(request, response){

    var MongoClient = require('mongodb').MongoClient;
      
      var poll_id = request.body.id;
      var new_option = request.body.option;
      
      var o_id = new require('mongodb').ObjectID(poll_id);

      
      if (request.isAuthenticated()){
      
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


                  if (result.options.indexOf(new_option) != -1){
                    response.status(200).send({"result" : "error",
                                    "error": "Option already exists"});
                  } else {

                    var new_options = result.options;
                    new_options.push(new_option);

                    var new_votes = result.votes;
                    new_votes.push(0);

                    var chart_data = [["Option", "Votes"]];

                    for (var i in new_options){
                      chart_data.push([new_options[i], new_votes[i]]);
                    }


                    var new_total_votes = result.total_votes + 1;

                    collection.update({"_id": o_id}, 
                      {$set : {votes: new_votes,
                               options: new_options}}, function (error, result){

                      if (error || !result){
                        response.status(200).send({"result" : "error",
                                    "error": "Error encountered while adding option"});
                      }

                      if (result){
                        response.status(200).send({ "result": "success",
                                                    "chart_data": chart_data});
                      } 
                    }); 

                  }
                }

            });
          });
        });  
      } else {
        response.status(200).send({"result" : "error",
                                    "error": "You've been logged out due to inactivity. Please login again before adding options."});
      }
    });
  },

  delete_poll(app){
    app.post('/delete', function(request, response){
      
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

            if (!result){
              response.send({"result": "error",
                            "error": "Poll not found."});
            } else if (result.poster != request.user){
              response.send({"result": "error",
                            "error": "You are not the owner of this poll."});
            } else {

              collection.remove({"_id": o_id}, function (err, result){

                if (err){
                  throw err;
                  return;
                }

                response.send({"result" : "success"});
              });
            }
          });
        });
      });
    });
  }
  
}