var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var compress = require('compression');
app.use(compress());

var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/gameserver2048';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
  db = databaseConnection;
});

app.post('/submit', function(request, response) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With");

  var username = request.body.username;
  var score = request.body.score;
  var grid = request.body.grid;
  //console.log(validator.isInt(score));
  console.log(username);
  console.log(score);
  console.log(grid);
  if (username != undefined && score != undefined && grid != undefined && validator.isInt(score) && validator.isJSON(grid)) {
    score = parseInt(score);
    console.log('worked');
    var toInsert = {
      "username":username,
      "score":score,
      "grid":grid,
      "created_at":new Date()
    };
    db.collection('scores', function(error, collection) {
      collection.insert(toInsert, function (errorUpdate, result) {
        if (!error) {
          collection.find().sort({"score":-1}).limit(10).toArray(function(errorQuery, allScores) {
            if (!errorQuery) {
              response.send(allScores);
            }
            else {
              console.log("3");
              response.send('{"error":"Whoops, something is wrong with the database connection"}');
            }
          });
        }
        else {
          console.log("2");
          response.send('{"error":"Whoops, something is wrong with the database connection"}');
        }
      });
    });
  }
  else {
    console.log("1");
    response.send('{"error":"Whoops, something is wrong with your data!"}');
  }
});

app.get('/scores.json', function(request, response) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With");

  var usernameEntry = request.query.username;
  if (usernameEntry == undefined || usernameEntry == null) {
    response.send("[]");
  }
  else {
    db.collection('scores', function(error, collection) {
      collection.find({username:usernameEntry}).sort({"score":-1}).toArray(function(error, results) {
        if (!results) {
          response.send("[]");
        }
        else {
          response.send(results);
        }
      });
    });
  }
});

app.get('/', function(request, response) {
  response.set('Content-Type', 'text/html');
  var indexPage = '';
  db.collection('scores', function(error, collection) {
    collection.find().sort({"score":-1}).toArray(function(error, results) {
      if (!error) {
        indexPage += "<!DOCTYPE HTML><html><head><title>2048 Game Server</title></head><body><h1>2048 Game Server</h1><ul>";
        if (results.length == 0) {
          indexPage += "<li>No scores</li>";
        }
        else {
          for (var count = 0; count < results.length; count++) {
            indexPage += "<li>" + results[count].username + " scored " + results[count].score + " on " + results[count].created_at + "</li>";
          }
        }
        indexPage += "</ul></body></html>"
        response.send(indexPage);
      } else {
        response.send('<!DOCTYPE HTML><html><head><title>2048 Game Server</title></head><body><h1>2048 Game Server</h1><p>Whoops, something went terribly wrong!</p></body></html>');
      }
    });
  });
});

app.listen(process.env.PORT || 3000);
